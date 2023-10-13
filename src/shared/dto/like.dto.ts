import { CommentDto, UserDto, VideoDto } from '@shared';

export class LikeDto {
	like: Like;
}

export interface Like {
	id: number;
	likedVideo: VideoDto;
	likedComment: CommentDto;
	author: UserDto;
}
export class DislikeDto {
	dislike: Dislike;
}

export interface Dislike {
	id: number;
	dislikedVideo: VideoDto;
	dislikedComment: CommentDto;
	author: UserDto;
}
