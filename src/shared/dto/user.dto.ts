import { UserEntity } from '@entity';
import { CommentDto } from './commant.dto';
import { VideoDto } from '../types';

export class User {
	user: Omit<UserEntity, 'checkPassword' | 'hash'>;
}
export class UserDto {
	user: UserResponse;
}
export interface UserResponse {
	comments: CommentDto[];
	videos: VideoDto[];
	username: string;
	password: string;
	email: string;
	token: string;
	registerDate: string;
	registerTime: bigint;
	timeAfterRegister: string;
	watchedVideos: VideoDto[];
}
