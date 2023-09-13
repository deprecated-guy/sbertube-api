import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, VideoEntity } from '@entity';
import { Repository } from 'typeorm';
import {Comment, User, UserRequest, Video} from '@shared';

import { VideoDto } from '../shared/types/video.dto';
let id = 0;
@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  public async uploadVideo(
    file: Express.Multer.File,
    body: Video,
    userData: UserEntity,
  ) {
    const findVideo = await this.videoRepo.findOne({
      where: {
        title: body.title,
      },
      relations: ['author'],
    });
    const user = await this.userRepo.findOne({
      where: {
        email: userData.email,
      },
      relations: ['videos'],
    });

    if (!findVideo && user) {
      const newVideo: VideoEntity = {
        id: id++,
        shortBody: body.shortBody,
        body: body.body,
        title: body.title,
        path: file.path,
        author: user,
        comments: []
      };
      const newFile = this.videoRepo.create(newVideo);
      user.videos.push(newFile);
      await this.videoRepo.save(newFile);
      await this.userRepo.save(user);
      return this.makeDto(newFile);
    }
    throw new HttpException(
      'This video may be uploaded recently',
      HttpStatus.FOUND,
    );
  }

  public async getAll() {
    const videos = await this.videoRepo.find({ relations: ['author'] });
    return videos.map((video) => {
      return this.makeDto(video);
    });
  }

  async updateVideo(body: Video, userData: User) {
    const file = await this.videoRepo.findOne({
      where: {
        id: body.id,
      },
      relations: ['author'],
    });
    const user = await this.userRepo.findOne({
      where: {
        email: userData.user.email,
      },
      relations: ['videos'],
    });
    const isMatch = user.email === file.author.email;
    if (!isMatch)
      throw new HttpException(
        'incorrect credentials',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const updatedVideo: VideoEntity = {
      id: body.id,
      shortBody: body.shortBody,
      body: body.body,
      title: body.title,
      path: file.path,
      author: user,
      comments: file.comments
    };
    await this.videoRepo.update(file.id, {
      id: updatedVideo.id,
      title: updatedVideo.title,
      body: updatedVideo.body,
      shortBody: updatedVideo.shortBody,
      author: updatedVideo.author,
    });
    user.videos.map((video) => (video.id === file.id ? file : video));

    return this.makeDto(updatedVideo);
  }
  public async deleteVideo(body: Video) {
    const video = await this.videoRepo.findOne({
      where: {
        title: body.title,
      },
      relations: ['author'],
    });
    if (!video) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    await this.videoRepo.remove(video);
  }
  public async getVideoByTitle(title: string) {
    const video = await this.videoRepo.findOne({
      where: { title },
      relations: ['author'],
    });
    if (!video) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return this.makeDto(video);
  }
  private makeDto(entity: VideoEntity): VideoDto {
    const { author, ...other } = entity;
    return {
      video: {
        ...other,
        author: author as unknown as User,
        comments: other.comments as unknown as Comment[]
      }
    };
  }
}
