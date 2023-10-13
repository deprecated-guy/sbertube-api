import { ApiProperty } from '@nestjs/swagger';

export class CommentInput {
	@ApiProperty({
		name: 'videoId',
		title: 'videoId',
		example: '1',
	})
	videoId: number;
	@ApiProperty({
		name: 'title',
		title: 'title',
		example: 'My Best Comment Ever',
	})
	title: string;
	@ApiProperty({
		name: 'body',
		title: 'body',
		example: 'My Best Comment Ever',
	})
	body: string;

	editedAt: string;
}
