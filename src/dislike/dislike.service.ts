import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, DislikeEntity, UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { Comment, CommentDto, DislikeDto, LikeRequest, User, UserDto, UserResponse, Video, VideoDto } from '@shared';

@Injectable()
export class DislikeService {
	public async createDislike(user: User, like: LikeRequest) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['dislikes'],
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

		const newLike = await this.dislikeRepo.create();
		newLike.author = author;

		if (like.commentId) {
			newLike.dislikedComment = comment;
			comment.isDisliked = true;
			comment.dislikesCount += 1;

			await this.commentRepo.save(comment);
			return this.makeDto(newLike);
		} else if (like.videoId) {
			newLike.dislikedVideo = video;
			video.likesCount += 1;
			video.isLiked = true;

			await this.videoRepo.save(video);
			return this.makeDto(newLike);
		}
		await this.userRepo.save(author);
	}

	public async removeDislikeFromComment(user: User, dislikeId: number, commentId: number) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['dislikes'],
		});

		const comment = await this.commentRepo.findOne({
			where: { id: commentId },
			relations: ['dislikes'],
		});

		if (!author) throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);

		if (commentId) {
			if (!comment) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

			const findDislike = comment.dislikes.find((like) => like.id == dislikeId);
			comment.dislikes = comment.dislikes.filter((like) => like.id !== findDislike.id);
			comment.dislikesCount -= 1;
			comment.isDisliked = false;

			await this.commentRepo.save(comment);
			await this.dislikeRepo.remove(findDislike);
		}
	}

	public async removeDislikeFromVideo(user: User, videoId: number, likeId: number) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['dislikes'],
		});

		const video = await this.videoRepo.findOne({
			where: { id: videoId },
			relations: ['dislikes'],
		});

		if (!author) throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);

		if (videoId) {
			if (!video) throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
			const findDislike = video.dislikes.find((like) => like.id == likeId);
			video.dislikes = video.dislikes.filter((like) => like.id !== findDislike.id);
			video.dislikesCount -= 1;
			video.isDisliked = false;

			await this.commentRepo.save(video);
			await this.dislikeRepo.remove(findDislike);
		}
	}

	private makeDto(entity: DislikeEntity): DislikeDto {
		const likedVideo: VideoDto = {
			video: entity.dislikedVideo as unknown as Video,
		};

		const likedComment: CommentDto = {
			comment: entity.dislikedComment as unknown as Comment,
		};

		const author: UserDto = {
			user: entity.author as unknown as UserResponse,
		};

		return {
			dislike: {
				id: entity.id,
				author: author,
				dislikedVideo: likedVideo,
				dislikedComment: likedComment,
			},
		};
	}

	constructor(
		@InjectRepository(DislikeEntity)
		private dislikeRepo: Repository<DislikeEntity>,
		@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
		@InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
		@InjectRepository(CommentEntity)
		private commentRepo: Repository<CommentEntity>,
	) {}
}
