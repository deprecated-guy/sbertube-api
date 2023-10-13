import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { VideoEntity } from './video.entity';
import { LikeEntity } from './like.entity';

@Entity('comment')
export class CommentEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	body: string;
	@Column()
	likesCount: number;

	@ManyToOne(() => UserEntity, (user) => user.comments)
	author: UserEntity;

	@ManyToOne(() => VideoEntity, (video) => video.comments)
	commentedVideo: VideoEntity;

	@Column('')
	createdAt: string;

	@Column({ default: false })
	isEdited: boolean;

	@Column('')
	editedAt: string;

	@OneToMany(() => LikeEntity, (like) => like.likedComment)
	likes: LikeEntity[];
}
