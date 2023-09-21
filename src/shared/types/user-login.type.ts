import { ApiProperty } from '@nestjs/swagger';

export class UserLogin {
	@ApiProperty({ description: 'Email', example: 'test@123.com' })
	email: string;

	@ApiProperty({ description: 'Username', example: 'test' })
	username: string;

	@ApiProperty({ description: 'Password', example: 'test' })
	password: string;
}
