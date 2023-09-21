import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity, UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import { CommentInput, CommentDto, VideoDto } from '@shared';

import { User } from '@shared';

@Injectable()
export class CommentService {
	public async getById(id: number): Promise<CommentDto> {
		return this.makeDto(await this.commentRepo.findOneBy({ id }));
	}
	public async createComment(comment: CommentInput, user: User) {
		const newComment = await this.commentRepo.create(comment);
		const video = await this.videoRepo.findOneBy({
			id: comment.videoId,
		});

		const author = await this.userRepo.findOneBy({
			id: user.user.id,
		});

		newComment.commentedVideo = video;
		newComment.author = author;

		const savedComment = await this.commentRepo.save(newComment);

		return this.makeDto(savedComment);
	}

	public async editComment(id: number, commentData: CommentInput) {
		const comment = await this.commentRepo.findOneBy({ id });

		if (!comment) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		Object.assign(comment, { commentData });

		return this.makeDto(await this.commentRepo.save(commentData));
	}
	public async delete(id: number) {
		const comment = await this.commentRepo.findOneBy({ id });

		if (!comment) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		await this.commentRepo.remove(comment);

		return;
	}

	public makeDto(entity: CommentEntity): CommentDto {
		return {
			comment: {
				id: entity.id,
				title: entity.title,
				body: entity.body,
				commentedVideo: entity.commentedVideo as unknown as VideoDto,
				author: entity.author as unknown as User,
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
