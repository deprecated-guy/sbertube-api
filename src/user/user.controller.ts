import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserEdit, JwtGuard, User } from '@shared';
import { UserService } from './user.service';
import { UserRequest } from '@shared';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
	@ApiTags('Edit User')
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiBody({
		description: 'Edit User Data',
		type: UserEdit,
	})
	@ApiResponse({
		type: User,
	})
	@ApiForbiddenResponse()
	@UsePipes(new ValidationPipe())
	@UseGuards(JwtGuard)
	@Put()
	async editUser(@Req() req: Request, @Body() data: UserEdit) {
		return await this.userService.editUser(data);
	}

	@ApiTags('Delete User')
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiForbiddenResponse()
	@UsePipes(new ValidationPipe())
	@UseGuards(JwtGuard)
	@Delete()
	async deleteUser(@Req() req: UserRequest) {
		return await this.userService.deleteUser(req.user);
	}

	@ApiTags('Get Current User')
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiResponse({
		type: User,
	})
	@ApiForbiddenResponse()
	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Get('account')
	async getCurrentUser(@Req() req: UserRequest) {
		return await this.userService.getCurrentUser(req.user);
	}

	@ApiTags('Get User By Username')
	@ApiForbiddenResponse()
	@UsePipes(new ValidationPipe())
	@Get(':username')
	async getUser(@Param('username') username: string) {
		return await this.userService.getOneUserByUsername(username);
	}

	constructor(private userService: UserService) {}
}
