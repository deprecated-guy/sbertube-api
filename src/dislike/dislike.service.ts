import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, DislikeEntity, UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { Comment, CommentDto, DislikeDto, User, UserDto, UserResponse, Video, VideoDto } from '@shared';

@Injectable()
export class DislikeService {
	public async dislikeVideo(user: User, id: number) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['dislikes'],
		});

		const video = await this.videoRepo.findOne({
			where: { id: id },
			relations: ['dislikes'],
		});

		if (!user) throw new HttpException('NotAuthorized', HttpStatus.UNAUTHORIZED);

		const newLike = this.dislikeRepo.create();
		newLike.author = author;
		if (video.isLiked && video.likesCount > 0) {
			video.likesCount -= 1;
			video.isLiked = false;
		}

		newLike.dislikedVideo = video;
		video.dislikesCount += 1;
		video.isDisliked = true;

		await this.videoRepo.save(video);
		await this.userRepo.save(author);
		console.log(newLike);
		return this.makeDto(await this.dislikeRepo.save(newLike));
	}

	public async dislikeComment(user: User, id: number) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['dislikes'],
		});

		const comment = await this.commentRepo.findOne({
			where: { id },
			relations: ['dislikes'],
		});

		const dislike = this.dislikeRepo.create();

		if (!user) throw new HttpException('Unregistered', HttpStatus.UNAUTHORIZED);
		dislike.author = author;
		dislike.dislikedComment = comment;
		if (comment.isLiked && comment.likesCount > 0) {
			comment.likesCount -= 1;
			comment.isLiked = false;
		}
		comment.dislikesCount += 1;
		comment.isDisliked = true;
		await this.commentRepo.save(comment);
		await this.userRepo.save(author);
		this.makeDto(await this.dislikeRepo.save(dislike));
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
		console.log(entity);

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
