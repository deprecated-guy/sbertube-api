import { DislikeDto, LikeDto, UserDto, VideoDto } from '@shared';
import { ApiProperty } from '@nestjs/swagger';

export class Comment {
	id: number;
	@ApiProperty({
		name: 'Title',
		title: 'Title',
		example: 'My Best Comment Ever',
	})
	title: string;

	@ApiProperty({ name: 'Body', title: 'Body', example: 'My Best Comment Ever' })
	body: string;

	@ApiProperty()
	likesCount: number;

	@ApiProperty()
	dislikesCount: number;

	@ApiProperty()
	createdAt: string;

	@ApiProperty()
	editedAt: string;

	@ApiProperty()
	isLiked: boolean;

	@ApiProperty()
	isDisliked: boolean;

	@ApiProperty()
	isEdited: boolean;

	author: UserDto;

	likes: LikeDto[];
	dislikes: DislikeDto[];

	commentedVideo: VideoDto;
}
