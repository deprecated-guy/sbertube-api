import { ApiProperty } from '@nestjs/swagger';

export class UserEdit {
	@ApiProperty({ description: 'Email' })
	email: string;

	@ApiProperty({ description: 'Username' })
	username: string;

	@ApiProperty({ description: 'Password' })
	password: string;
}
