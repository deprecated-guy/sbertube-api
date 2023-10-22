import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { CommentDto, User, UserDto, UserEdit, VideoDto } from '@shared';
import * as bcrypt from 'bcrypt';
import { format } from 'date-fns';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
	public async editUser(data: UserEdit): Promise<UserDto> {
		const user = await this.userRepo.findOne({
			where: {
				email: data.email,
			},
			relations: ['videos', 'comments', 'likes'],
		});

		if (!user) {
			throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
		}
		const checked = await bcrypt.compare(data.password, user.password);
		console.log(checked);

		const updatedFields = {
			username: data.username !== '' ? data.username : user.username,
			bannerBackground: data.bannerBackground !== '' ? data.bannerBackground : user.bannerBackground,
			avatarBackground: data.avatarBackground !== '' ? data.avatarBackground : user.avatarBackground,
			password: !checked ? await hash(data.password, 10) : user.password,
			checkPassword: !checked ? await hash(data.password, 10) : user.checkPassword,
		};

		await this.userRepo.update(user.id, updatedFields);

		const findUser = await this.userRepo.findOne({
			where: {
				email: data.email,
			},
			relations: ['videos', 'comments', 'likes'],
		});

		return this.makeDto(await this.userRepo.save(findUser));
	}

	public async deleteUser(userData: User) {
		const user = await this.userRepo.findOne({
			where: { id: userData.user.id },
			relations: ['videos', 'comments', 'likes', 'dislikes'],
		});

		if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

		user.videos.map((video) => this.videoRepo.remove(video));

		await this.userRepo.remove(user);
	}

	public makeDto(user: UserEntity): UserDto {
		const dto = user;

		delete dto.checkPassword;
		delete dto.id;

		const watchedVideos = dto.videos.filter((video) => {
			return video.isViewed;
		});

		const comments = dto.comments.map((c) => {
			return {
				comment: {
					...c,
					author: c.author as unknown as UserDto,
					commentedVideo: c.commentedVideo,
				},
			};
		});

		const videosWithAuthor = dto.videos.map((video) => {
			return {
				video: {
					...video,
					comments: comments as unknown as CommentDto[],
					path: video.path,
					author: {
						user: {
							...video.author,
						},
					},
				},
			};
		});

		return {
			user: {
				bannerBackground: dto.bannerBackground,
				avatarBackground: dto.avatarBackground,
				watchedVideos: watchedVideos as unknown as VideoDto[],
				username: dto.username,
				password: dto.password,
				comments: dto.comments as unknown as CommentDto[],
				videos: videosWithAuthor as unknown as VideoDto[],
				email: dto.email,
				token: dto.token,
				registerDate: dto.registerDate,
				registerTime: dto.registerTime,
				timeAfterRegister: format(Date.now() - Number(dto.registerTime), 'Y.M.dd HH:mm:ss'),
			},
		};
	}

	public async getOneUserByUsername(username: string) {
		const user = await this.userRepo.findOne({
			where: {
				username,
			},
			relations: ['videos', 'comments', 'likes'],
		});

		if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

		return this.makeDto(user);
	}

	public async getCurrentUser(userData: User) {
		const user = await this.userRepo.findOne({
			where: { id: userData.user.id },
			relations: ['videos', 'comments', 'likes'],
		});
		console.log(user);
		if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		return this.makeDto(user);
	}

	constructor(
		@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
		@InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
	) {}
}
