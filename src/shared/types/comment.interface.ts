import { UserDto, VideoDto } from '@shared';
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
	createdAt: string;

	@ApiProperty()
	editedAt: string;
	author: UserDto;

	isEdited: boolean;
	commentedVideo: VideoDto;
}
