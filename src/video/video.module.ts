import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, VideoEntity } from '@entity';
import { MulterModule } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@shared';

@Module({
  controllers: [VideoController],
  imports: [
    TypeOrmModule.forFeature([UserEntity, VideoEntity]),
    MulterModule.register({
      dest: './static',
    }),
  ],
  providers: [VideoService, JwtService, ConfigService],
})
export class VideoModule {}
