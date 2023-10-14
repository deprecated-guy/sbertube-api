import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { User, UserLogin, UserRegister } from '@shared';
import { AuthService } from './auth.service';
import { ApiBody, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
	@UsePipes(new ValidationPipe())
	@ApiBody({
		required: true,
		description: 'User Login Data',
		type: UserLogin,
	})
	@ApiResponse({ status: 200, description: 'OK', type: User })
	@ApiForbiddenResponse()
	@Post('login')
	@ApiTags('login')
	login(@Body() body: UserLogin) {
		return this.authService.loginUser(body);
	}

	@ApiTags('register')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				email: {
					type: 'string',
					example: 'johnwick22@mail.ru',
				},
				username: {
					type: 'string',
					example: 'John Wick',
				},
				password: {
					type: 'string',
					example: 'killemall',
				},
				checkPassword: {
					type: 'string',
					example: 'killemall',
				},
			},
		},
	})
	@Post('register')
	@UsePipes(new ValidationPipe())
	@ApiResponse({ status: 200, description: 'OK', type: User })
	async register(@Body() body: UserRegister) {
		return await this.authService.createUser(body);
	}

	constructor(private authService: AuthService) {}
}
