import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { User, UserLogin, UserRegister } from '@shared';
import { AuthService } from './auth.service';
import { ApiBody, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from '../email.service';
import { UserEntity } from '@entity';
import { Code } from '../shared/types/code.type';

export const user = {} as UserEntity;

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
		console.log(body);
		const { user } = await this.authService.createUser(body);
		await this.emailService.sendEmail(user.username, body.email, user.activationCode);
		return {
			id: user.id,
			activationCode: user.activationCode,
		};
	}

	@Post('activate/:id')
	async activateAccount(@Body() code: Code, @Param('id') id: number) {
		console.log(code);
		console.log(id);
		return await this.authService.verifyUser(id, code.code);
	}
	constructor(
		private authService: AuthService,
		private emailService: EmailService,
	) {}
}
