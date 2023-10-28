import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { CommentInput, CommentDto, VideoDto, UserDto, LikeDto, DislikeDto } from '@shared';

import { User } from '@shared';

@Injectable()
export class CommentService {
	public async getById(id: number): Promise<CommentDto> {
		return this.makeDto(
			await this.commentRepo.findOne({
				where: { id },
				relations: ['likes', 'author', 'commentedVideo'],
			}),
		);
	}
	public async createComment(comment: CommentInput, user: User) {
		const newComment = await this.commentRepo.create(comment);
		const video = await this.videoRepo.findOneBy({
			id: comment.videoId,
		});

		const author = await this.userRepo.findOneBy({
			id: user.user.id,
		});
		newComment.isEdited = false;
		newComment.createdAt = new Date().toISOString();
		newComment.editedAt = '';
		newComment.commentedVideo = video;
		newComment.author = author;
		newComment.likes = [];
		newComment.likesCount = 0;

		return this.makeDto(await this.commentRepo.save(newComment));
	}

	public async editComment(id: number, commentData: CommentInput) {
		const comment = await this.commentRepo.findOneBy({ id });

		if (!comment) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		Object.assign(comment, { commentData });
		comment.isEdited = true;
		comment.editedAt = commentData.editedAt;

		return this.makeDto(await this.commentRepo.save(commentData));
	}
	public async delete(id: number) {
		const comment = await this.commentRepo.findBy({ id });

		if (!comment) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		await this.commentRepo.remove(comment);

		return;
	}

	public makeDto(entity: CommentEntity): CommentDto {
		return {
			comment: {
				dislikesCount: entity.dislikesCount,
				isDisliked: entity.isDisliked,
				dislikes: entity.dislikes as unknown as DislikeDto[],
				isLiked: entity.isLiked,
				isEdited: entity.isEdited,
				createdAt: entity.createdAt,
				editedAt: entity.editedAt,
				id: entity.id,
				likes: entity.likes as unknown as LikeDto[],
				title: entity.title,
				body: entity.body,
				likesCount: entity.likesCount,
				commentedVideo: entity.commentedVideo as unknown as VideoDto,
				author: entity.author as unknown as UserDto,
			},
		};
	}

	constructor(
		@InjectRepository(CommentEntity)
		private commentRepo: Repository<CommentEntity>,
		@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
		@InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
	) {}
}
