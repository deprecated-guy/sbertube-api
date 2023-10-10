import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { User, UserEdit } from '@shared';
import * as bcrypt from 'bcrypt';
import { format } from 'date-fns';

@Injectable()
export class UserService {
	public async editUser(data: UserEdit): Promise<User> {
		const user = await this.userRepo.findOne({
			where: {
				email: data.email,
			},
			relations: ['videos', 'comments', 'likes'],
		});

		if (!user) {
			throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
		}

		const password = await bcrypt.hash(data.password, 10);

		const newUser = {
			...user,
			password: password,
			checkPassword: password,
		};

		Object.assign(user, newUser);

		await this.userRepo.save(user);

		const editedUser = await this.userRepo.findOne({
			where: { email: user.email },
			relations: ['videos', 'comments', 'likes'],
		});

		return this.makeDto(editedUser);
	}

	public async deleteUser(userData: User) {
		const user = await this.userRepo.findOne({
			where: { id: userData.user.id },
			relations: ['videos', 'comments', 'likes'],
		});

		if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

		user.videos.map((video) => this.videoRepo.remove(video));

		await this.userRepo.remove(user);
	}

	public makeDto(user: UserEntity): User {
		const dto = user;

		delete dto.checkPassword;
		delete dto.id;

		const watchedVideos = dto.videos.filter((video) => {
			return video.isViewed;
		});

		const videosWithAuthor = dto.videos.map((video) => {
			return {
				...video,
				comments: video.comments,
				path: video.path,
				author: {
					id: dto.id,
					username: dto.username,
					password: dto.password,
					comments: dto.comments as unknown as CommentEntity[],
					videos: dto.videos as unknown as VideoEntity[],
					email: dto.email,
					token: dto.token,
				},
			};
		});

		return {
			user: {
				id: dto.id,
				username: dto.username,
				password: dto.password,
				likes: dto.likes,
				comments: dto.comments as unknown as CommentEntity[],
				videos: videosWithAuthor as unknown as VideoEntity[],
				viewedVideos: watchedVideos as unknown as VideoEntity[],
				email: dto.email,
				token: dto.token,
				registerDate: dto.registerDate,
				registerTime: dto.registerTime,
				timeAfterRegister: format(
					Date.now() - Number(dto.registerTime),
					'Y.M.dd HH:mm:ss',
				),
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
		if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		return this.makeDto(user);
	}

	constructor(
		@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
		@InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
	) {}
}
