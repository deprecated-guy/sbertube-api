import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { ConfigService, typeOrmFeaturesFactory } from '@shared';
import { join } from 'path';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [VideoController],
	imports: [
		TypeOrmModule.forFeature(typeOrmFeaturesFactory(['Video', 'User', 'Comment'])),
		MulterModule.register({
			dest: join(__dirname, '..', 'static'),
		}),
	],
	providers: [VideoService, JwtService, ConfigService],
})
export class VideoModule {}
