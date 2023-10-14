import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { VideoEntity } from './video.entity';
import { CommentEntity } from './comment.entity';

@Entity('like')
export class LikeEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity, (user) => user.likes)
	author: UserEntity;

	@ManyToOne(() => VideoEntity, (video) => video.likes)
	likedVideo: VideoEntity;

	@ManyToOne(() => CommentEntity, (comment) => comment.likes)
	likedComment: CommentEntity;
}
@Entity('dislike')
export class DislikeEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity, (user) => user.dislikes)
	author: UserEntity;

	@ManyToOne(() => VideoEntity, (video) => video.dislikes)
	dislikedVideo: VideoEntity;

	@ManyToOne(() => CommentEntity, (comment) => comment.dislikes)
	dislikedComment: CommentEntity;
}
