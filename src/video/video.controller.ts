import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { JwtGuard, VideoDto, VideoInput } from '@shared';
import { FileInterceptor } from '@nestjs/platform-express';
import { Video } from '@shared';
import { diskStorage } from 'multer';
import { VideoService } from './video.service';
import { UserRequest } from '@shared';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiForbiddenResponse,
	ApiHeader,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';

@Controller('video')
export class VideoController {
	@ApiBearerAuth()
	@ApiTags('Get Videos')
	@UsePipes(new ValidationPipe())
	@ApiForbiddenResponse()
	@Get()
	async getAll() {
		return await this.videoService.getAll();
	}

	@ApiBearerAuth()
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiTags('Upload Video')
	@UsePipes(new ValidationPipe())
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'file',
					format: 'binary',
				},
				title: {
					type: 'string',
					example: 'My Best Video Ever',
				},
				shortBody: {
					type: 'string',
					example: 'My Best Video Ever',
				},
				body: {
					type: 'string',
					example: 'My Best Video Ever',
				},
			},
		},
	})
	@ApiResponse({ type: VideoDto })
	@ApiForbiddenResponse()
	@UseGuards(JwtGuard)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './static/video',
				filename(
					req,
					file: Express.Multer.File,
					callback: (error: Error | null, filename: string) => void,
				) {
					const filename = `${file.originalname}`;
					callback(null, filename);
				},
			}),
		}),
	)
	@Post()
	async uploadVideo(
		@Req() req: UserRequest,
		@UploadedFile() file: Express.Multer.File,
		@Body() body: VideoInput,
	) {
		const user = req.user.user;
		console.log(body);
		return await this.videoService.uploadVideo(file, body, user);
	}

	@ApiTags('Edit Video')
	@ApiBearerAuth()
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiBody({
		schema: {
			properties: {
				title: {
					type: 'string',
					example: 'Me best video ever(renamed)',
				},
				body: {
					type: 'string',
					example: 'Me best video ever(renamed)',
				},
				shortBody: {
					type: 'string',
					example: 'Me best video ever(renamed)',
				},
			},
		},
	})
	@ApiResponse({ type: VideoDto })
	@ApiForbiddenResponse()
	@UsePipes(new ValidationPipe())
	@UseGuards(JwtGuard)
	@Put()
	async updateVideo(@Req() req: UserRequest, @Body() body: VideoInput) {
		const user = req.user;
		return await this.videoService.updateVideo(body, user);
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
	async getVideoByTitle(@Param('title') title: string) {
		return await this.videoService.getVideoByTitle(title);
	}
	constructor(private videoService: VideoService) {}
}
