import { ApiProperty } from '@nestjs/swagger';

export class UserEdit {
	@ApiProperty({ description: 'Email' })
	email: string;

	@ApiProperty({ description: 'Username' })
	username: string;

	@ApiProperty({ description: 'Password' })
	password: string;

	@ApiProperty({ description: 'Banner Background' })
	bannerBackground: string;

	@ApiProperty({ description: 'Avatar Background' })
	avatarBackground: string;

	@ApiProperty({ description: 'Avatar Background' })
	bio: string;
}
