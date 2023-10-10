import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { User, Video, VideoInput, VideoDto, CommentDto } from '@shared';
import getVideoDurationInSeconds from 'get-video-duration';

@Injectable()
export class VideoService {
	public async uploadVideo(
		file: Express.Multer.File,
		body: VideoInput,
		userData: User,
	): Promise<VideoDto> {
		const findVideo = await this.videoRepo.findOne({
			where: {
				title: body.title,
			},
			relations: ['author', 'comments', 'likes'],
		});

		const user = await this.userRepo.findOne({
			where: {
				email: userData.user.email,
			},
			relations: ['videos', 'comments', 'likes'],
		});

		if (!findVideo && user) {
			const newFile = await this.videoRepo.create(body);
			newFile.path = file.path;
			newFile.comments = [];
			newFile.isViewed = false;
			newFile.likes = [];
			newFile.likesCount = 0;
			newFile.timeToWatch = await getVideoDurationInSeconds(newFile.path);
			newFile.watchedTime = 0;
			user.videos.push(newFile);
			await this.videoRepo.save(newFile);
			await this.userRepo.save(user);
			console.log(newFile.timeToWatch);
			return this.makeDto(newFile);
		}
		throw new HttpException(
			'This video may be uploaded recently',
			HttpStatus.FOUND,
		);
	}

	public async getAll(): Promise<VideoDto[]> {
		const videos = await this.videoRepo.find({
			relations: ['author', 'comments', 'likes'],
		});

		return videos.map((video) => ({
			video: {
				...video,
				path: video.path,
				author: video.author as unknown as User,
				comments: video.comments as unknown as CommentDto[],
			},
		}));
	}

	async updateVideo(
		body: VideoInput,
		title: string,
		userData: User,
	): Promise<VideoDto> {
		const file = await this.videoRepo.findOne({
			where: {
				title,
			},
			relations: ['author', 'comments', 'likes'],
		});

		const user = await this.userRepo.findOne({
			where: {
				email: userData.user.email,
			},
			relations: ['videos', 'comments', 'likes'],
		});

		const isMatch = user.email === file.author.email;
		if (!isMatch)
			throw new HttpException(
				'incorrect credentials',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);

		const updatedVideo: VideoEntity = {
			id: body.id,
			isViewed: true,
			likesCount: file.likes.length,
			likes: file.likes,
			timeToWatch: body.timeToWatch,
			watchedTime: body.watchedTime,
			shortBody: body.shortBody,
			body: body.body,
			title: body.title,
			path: file.path,
			author: user,
			comments: file.comments,
		};

		await this.videoRepo.update(file.id, {
			id: updatedVideo.id,
			title: updatedVideo.title,
			body: updatedVideo.body,
			shortBody: updatedVideo.shortBody,
			author: updatedVideo.author,
		});

		user.videos.map((video) => (video.id === file.id ? file : video));

		return this.makeDto(updatedVideo);
	}

	public async deleteVideo(body: Video) {
		const video = await this.videoRepo.findOne({
			where: {
				title: body.title,
			},
			relations: ['author', 'comments', 'likes'],
		});
		if (!video) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		await this.videoRepo.remove(video);
	}

	public async getVideoByTitle(title: string): Promise<VideoDto> {
		const video = await this.videoRepo.findOne({
			where: { title },
			relations: ['author', 'comments', 'likes'],
		});

		if (!video) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

		return this.makeDto(video);
	}

	private makeDto(entity: VideoEntity): VideoDto {
		return {
			video: {
				...entity,
				path: entity.path,
				author: entity.author as unknown as User,
				comments: entity.comments as unknown as CommentDto[],
			},
		};
	}

	constructor(
		@InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
		@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
	) {}
}
