import {
	BeforeInsert,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { VideoEntity } from './video.entity';
import { CommentEntity } from './comment.entity';

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

	@OneToMany(() => VideoEntity, (video) => video.author)
	videos: VideoEntity[];

	@Column()
	token: string;

	@OneToMany(() => CommentEntity, (comment) => comment.author)
	comments: CommentEntity[];

	@BeforeInsert()
	async hash() {
		this.password = await bcrypt.hash(this.password, 10);
		this.checkPassword = await bcrypt.hash(this.checkPassword, 10);
	}
}
