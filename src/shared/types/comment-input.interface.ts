import { ApiProperty } from '@nestjs/swagger';

export class CommentInput {
	@ApiProperty({
		name: 'videoId',
		title: 'videoId',
		example: '1',
	})
	videoId: number;

	@ApiProperty({
		name: 'body',
		title: 'body',
		example: 'My Best Comment Ever',
	})
	body: string;

	editedAt: string;
}
