import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { LikeEntity } from './like.entity';

@Entity('video')
export class VideoEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: '' })
	title: string;

	@Column({ default: '' })
	body: string;

	@Column({ default: '' })
	shortBody: string;

	@Column({ default: 0 })
	timeToWatch: number;

	@Column({ default: 0 })
	watchedTime: number;

	@Column({ default: false })
	isViewed: boolean;

	@Column({ default: '' })
	path: string;

	@ManyToOne(() => UserEntity, (user) => user.videos)
	author: UserEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.commentedVideo)
	comments: CommentEntity[];

	@OneToMany(() => LikeEntity, (like) => like.likedVideo)
	likes: LikeEntity[];

	@Column()
	likesCount: number;
}
