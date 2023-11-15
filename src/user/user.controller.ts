import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Put,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserEdit, JwtGuard, User } from '@shared';
import { UserService } from './user.service';
import { UserRequest } from '@shared';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Response } from 'express';
import * as process from 'process';

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
	@Delete('account/delete')
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
		console.log(username);
		return await this.userService.getOneUserByUsername(username);
	}

	@ApiTags('Upload UserBanner  Background Image')
	@ApiBearerAuth('Authorization')
	@ApiForbiddenResponse()
	@UsePipes(new ValidationPipe())
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './static/images/user/banner',
				filename(req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
					const filename = path.parse(file.originalname).name.replace(/./g, '') + uuid();

					const ext = path.parse(file.originalname).ext;

					callback(null, `${filename}${ext}`);
				},
			}),
		}),
	)
	@UseGuards(JwtGuard)
	@Put('account/updateBanner')
	async updateBannerImage(@Req() req: UserRequest, @UploadedFile() file: Express.Multer.File) {
		return await this.userService.updateUserBannerImage(req.user, file.filename);
	}
	@ApiTags('Upload User Avatar  Background Image')
	@ApiBearerAuth('Authorization')
	@ApiForbiddenResponse()
	@UsePipes(new ValidationPipe())
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './static/images/user/avatar',
				filename(req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
					const filename = path.parse(file.originalname).name.replace(/./g, '') + uuid();

					const ext = path.parse(file.originalname).ext;

					callback(null, `${filename}${ext}`);
				},
			}),
		}),
	)
	@UseGuards(JwtGuard)
	@Put('account/updateBanner')
	async updateAvatarImage(@Req() req: UserRequest, @UploadedFile() file: Express.Multer.File) {
		return await this.userService.updateUserAvatarImage(req.user, file.filename);
	}

	@Get('images/banner/:name')
	getBannerImage(@Param('name') name: string, @Res() res: Response) {
		return res.sendFile(path.resolve(process.cwd(), 'static', 'images', 'banner', name));
	}

	@Get('images/avatar/:name')
	getAvatarImage(@Param('name') name: string, @Res() res: Response) {
		return res.sendFile(path.resolve(process.cwd(), 'static', 'images', 'avatar', name));
	}

	constructor(private userService: UserService) {}
}
