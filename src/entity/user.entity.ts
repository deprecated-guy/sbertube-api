import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { VideoEntity } from './video.entity';
import { CommentEntity } from './comment.entity';
import { DislikeEntity, LikeEntity } from './like.entity';

@Entity('user')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('')
	email: string;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	checkPassword: string;

	@Column()
	token: string;

	@Column('')
	registerDate: string;

	@Column({ default: '' })
	timeAfterRegister: string;

	@Column({ default: 0, type: 'bigint' })
	registerTime: bigint;

	@Column('')
	activationCode: number;

	@Column({ default: false })
	isActivated: boolean;

	@OneToMany(() => VideoEntity, (video) => video.isViewed)
	viewedVideos: VideoEntity[];

	@OneToMany(() => VideoEntity, (video) => video.author)
	videos: VideoEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.author)
	comments: CommentEntity[];

	@OneToMany(() => LikeEntity, (like) => like.author)
	likes: LikeEntity[];
	@OneToMany(() => DislikeEntity, (like) => like.author)
	dislikes: DislikeEntity[];

	@Column('')
	bannerBackground: string;

	@Column('')
	bannerBackgroundImage: string;

	@Column('')
	avatarBackground: string;

	@Column('')
	avatarBackgroundImage: string;

	@BeforeInsert()
	async hash() {
		this.password = await bcrypt.hash(this.password, 10);
		this.checkPassword = await bcrypt.hash(this.checkPassword, 10);
	}
}
