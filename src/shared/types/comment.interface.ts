import { User, VideoDto } from '@shared';
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

	author: User;
	commentedVideo: VideoDto;
}
