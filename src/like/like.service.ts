import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, LikeEntity, UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { Comment, CommentDto, LikeDto, User, UserDto, UserResponse, Video, VideoDto } from '@shared';

@Injectable()
export class LikeService {
	public async likeVideo(user: User, id: number) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['likes'],
		});

		const video = await this.videoRepo.findOne({
			where: { id: id },
			relations: ['likes', 'comments'],
		});

		if (!user) throw new HttpException('NotAuthorized', HttpStatus.UNAUTHORIZED);

		const newLike = this.likeRepo.create();
		newLike.author = author;

		newLike.likedVideo = video;
		video.likesCount += 1;
		video.isLiked = true;

		if (video.isLiked && video.dislikesCount > 0) {
			video.dislikesCount -= 1;
			video.isDisliked = false;
		}
		await this.videoRepo.save(video);
		await this.userRepo.save(author);
		return this.makeDto(newLike);
	}

	public async likeComment(user: User, id: number) {
		const author = await this.userRepo.findOne({
			where: { id: user.user.id },
			relations: ['likes'],
		});

		const comment = await this.commentRepo.findOne({
			where: { id: id },
			relations: ['likes'],
		});

		if (!user) throw new HttpException('NotAuthorized', HttpStatus.UNAUTHORIZED);

		const newLike = this.likeRepo.create();
		newLike.author = author;

		newLike.likedComment = comment;
		comment.likesCount += 1;
		comment.isLiked = true;
		if (comment.isDisliked && comment.dislikesCount > 0) {
			comment.dislikesCount -= 1;
			comment.isDisliked = false;
		}
		await this.userRepo.save(author);
		await this.commentRepo.save(comment);
		return this.makeDto(newLike);
	}

	private makeDto(entity: LikeEntity): LikeDto {
		const likedVideo: VideoDto = {
			video: entity.likedVideo as unknown as Video,
		};

		const likedComment: CommentDto = {
			comment: entity.likedComment as unknown as Comment,
		};

		console.log(likedComment);

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
