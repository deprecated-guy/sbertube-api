import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Video, editVideoSchema, JwtGuard, uploadVideoScheme, VideoDto, VideoInput, UserRequest } from '@shared';
import { VideoService } from './video.service';

import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiForbiddenResponse,
	ApiHeader,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { resolvePath } from '@nestjs/swagger/dist/utils/resolve-path.util';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Controller('video')
export class VideoController {
	@ApiTags('Get Videos')
	@UsePipes(new ValidationPipe())
	@ApiForbiddenResponse()
	@Get()
	async getAll(@Query('p') search: string) {
		console.log(search);
		if (search) {
			return await this.videoService.getAll(search);
		} else return await this.videoService.getAll();
	}

	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiTags('Upload Video')
	@UsePipes(new ValidationPipe())
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: uploadVideoScheme,
	})
	@ApiResponse({ type: VideoDto })
	@ApiForbiddenResponse()
	@UseGuards(JwtGuard)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './static/video',
				filename(req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
					console.log(file);
					const filename = path.parse(file.originalname).name.replace(/./g, '') + uuid();

					const ext = path.parse(file.originalname).ext;

					callback(null, `${filename}${ext}`);
				},
			}),
		}),
	)
	@Post()
	async uploadVideo(@Req() req: UserRequest, @UploadedFile() file: Express.Multer.File, @Body() body: VideoInput) {
		const user = req.user;

		return await this.videoService.uploadVideo(file, body, user);
	}

	@ApiTags('Edit Video')
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiBody({
		schema: editVideoSchema,
	})
	@ApiResponse({ type: VideoDto })
	@ApiForbiddenResponse()
	@UsePipes(new ValidationPipe())
	@UseGuards(JwtGuard)
	@Put(':title')
	async updateVideo(@Req() req: UserRequest, @Body() body: VideoInput, @Param('title') title: string) {
		const user = req.user;

		return await this.videoService.updateVideo(body, title, user);
	}

	@Get('v/:videoTitle')
	async getVideoDtoByTitle(@Param('videoTitle') title: string) {
		return await this.videoService.getVideoByTitle(title);
	}

	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiTags('Delete Video')
	@UsePipes(new ValidationPipe())
	@ApiForbiddenResponse()
	@UseGuards(JwtGuard)
	@Delete()
	async deleteVideo(@Req() req: UserRequest, @Body() body: Video) {
		return await this.videoService.deleteVideo(body);
	}

	@Get(':title')
	async getVideoByTitle(@Param('title') title: string, @Res() res) {
		const video = await this.videoService.getVideoByTitle(title);

		return res.sendFile(resolvePath(video.video.path));
	}

	constructor(private videoService: VideoService) {}
}
