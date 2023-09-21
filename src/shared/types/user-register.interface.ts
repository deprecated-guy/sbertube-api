import { ApiProperty } from '@nestjs/swagger';

export class UserRegister {
	@ApiProperty({ description: 'Email' })
	email: string;

	@ApiProperty({ description: 'Username' })
	username: string;

	@ApiProperty({ description: 'Password' })
	password: string;

	@ApiProperty({ description: 'Write again' })
	checkPassword: string;
}
