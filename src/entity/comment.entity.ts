import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { VideoEntity } from './video.entity';
import { DislikeEntity, LikeEntity } from './like.entity';

@Entity('comment')
export class CommentEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	body: string;

	@Column({ default: 0 })
	likesCount: number;

	@ManyToOne(() => UserEntity, (user) => user.comments)
	author: UserEntity;

	@ManyToOne(() => VideoEntity, (video) => video.comments)
	commentedVideo: VideoEntity;

	@Column({ default: '' })
	createdAt: string;

	@Column({ default: false })
	isEdited: boolean;

	@Column({ default: false })
	isLiked: boolean;

	@Column({ default: '' })
	editedAt: string;

	@Column({ default: false })
	isDisliked: boolean;

	@OneToMany(() => LikeEntity, (like) => like.likedComment)
	likes: LikeEntity[];

	@OneToMany(() => DislikeEntity, (like) => like.dislikedComment)
	dislikes: DislikeEntity[];

	@Column({ default: 0 })
	dislikesCount: number;
}
