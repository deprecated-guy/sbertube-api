import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { typeOrmFeaturesFactory, typeOrmProvidersFactory } from '@shared';
import { join } from 'path';

@Module({
	controllers: [VideoController],
	imports: [
		TypeOrmModule.forFeature(typeOrmFeaturesFactory(['Video', 'User', 'Comment'])),
		MulterModule.register({
			dest: join(__dirname, '..', 'static'),
		}),
	],
	providers: typeOrmProvidersFactory(['JWT', 'Video', 'Config']),
})
export class VideoModule {}
