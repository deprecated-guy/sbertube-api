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
} from '@nestjs/common';
import { JwtGuard } from '@shared';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Video } from '@shared';
import { diskStorage } from 'multer';
import { VideoService } from './video.service';
import { UserRequest } from '@shared';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get()
  async getAll() {
    return await this.videoService.getAll();
  }
  @Post()
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
  async uploadVideo(
    @Req() req: UserRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Video,
  ) {
    const user = req.user.user;
    return await this.videoService.uploadVideo(file, body, user);
  }
  @Put()
  @UseGuards(JwtGuard)
  async updateVideo(@Req() req: UserRequest, @Body() body: Video) {
    const user = req.user;
    return await this.videoService.updateVideo(body, user);
  }
  @Delete()
  @UseGuards(JwtGuard)
  async deleteVideo(@Req() req: UserRequest, @Body() body: Video) {
    return await this.videoService.deleteVideo(body);
  }

  @Get(':title')
  async getVideoByTitle(@Param('title') title: string) {
    return await this.videoService.getVideoByTitle(title);
  }
}
