import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, LikeEntity, UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { Comment, CommentDto, LikeDto, LikeRequest, User, UserDto, UserResponse, Video, VideoDto } from '@shared';

@Injectable()
export class LikeService {
	public async createLike(user: User, like: LikeRequest) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['likes'],
		});

		const comment = await this.commentRepo.findOne({
			where: { id: like.commentId },
			relations: ['likes'],
		});

		const video = await this.videoRepo.findOne({
			where: { id: like.videoId },
			relations: ['likes'],
		});

		if (!user) throw new HttpException('NotAuthorized', HttpStatus.UNAUTHORIZED);

		const newLike = await this.likeRepo.create();
		newLike.author = author;

		if (like.commentId) {
			newLike.likedComment = comment;
			comment.isLiked = true;
			comment.likesCount += 1;

			await this.commentRepo.save(comment);
			return this.makeDto(newLike);
		} else if (like.videoId) {
			newLike.likedVideo = video;
			video.likesCount += 1;
			video.isLiked = true;

			await this.videoRepo.save(video);
			return this.makeDto(newLike);
		}
		await this.userRepo.save(author);
	}

	public async removeLikeFromComment(user: User, likeId: number, commentId: number) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['likes'],
		});

		const comment = await this.commentRepo.findOne({
			where: { id: commentId },
			relations: ['likes'],
		});

		if (!author) throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);

		if (commentId) {
			if (!comment) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

			const findLike = comment.likes.find((like) => like.id == likeId);
			comment.likes = comment.likes.filter((like) => like.id !== findLike.id);
			comment.likesCount -= 1;
			comment.isLiked = false;

			await this.commentRepo.save(comment);
			await this.likeRepo.remove(findLike);
		}
	}

	public async removeLikeFromVideo(user: User, videoId: number, likeId: number) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['likes'],
		});
		const video = await this.videoRepo.findOne({
			where: { id: videoId },
			relations: ['likes'],
		});

		if (!author) throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);

		if (videoId) {
			if (!video) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
			const findLike = video.likes.find((like) => like.id == likeId);
			video.likes = video.likes.filter((like) => like.id !== findLike.id);
			video.likesCount -= 1;
			video.isLiked = false;

			await this.commentRepo.save(video);
			await this.likeRepo.remove(findLike);
		}
	}

	private makeDto(entity: LikeEntity): LikeDto {
		const likedVideo: VideoDto = {
			video: entity.likedVideo as unknown as Video,
		};

		const likedComment: CommentDto = {
			comment: entity.likedComment as unknown as Comment,
		};

		const author: UserDto = {
			user: entity.author as unknown as UserResponse,
		};

		return {
			like: {
				id: entity.id,
				author: author,
				likedVideo: likedVideo,
				likedComment: likedComment,
			},
		};
	}

	constructor(
		@InjectRepository(LikeEntity) private likeRepo: Repository<LikeEntity>,
		@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
		@InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
		@InjectRepository(CommentEntity)
		private commentRepo: Repository<CommentEntity>,
	) {}
}
