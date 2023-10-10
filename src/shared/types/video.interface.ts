import { CommentDto, User } from '../dto';
import { ApiProperty } from '@nestjs/swagger';

export class Video {
	id: number;
	title: string;
	body: string;
	shortBody: string;
	path: string;
	author: User;
	comments: CommentDto[];
}

export class VideoInput {
	id: number;
	@ApiProperty({ example: 'My First Video' })
		title: string;
	@ApiProperty({ example: 'My Best Video Ever' })
		shortBody: string;
	@ApiProperty({ example: 'My  BEeeeeeeeeeeeeeeeeeeeeeeeeeeeeest Video ever' })
		body: string;
	@ApiProperty()
		timeToWatch: number;
	@ApiProperty()
		isViewed: boolean;
	@ApiProperty()
		watchedTime: number;
	@ApiProperty()
		viewsCount: number;
	@ApiProperty()
		likesCount: number;
}
