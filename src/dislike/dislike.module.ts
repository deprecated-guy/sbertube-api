import { Module } from '@nestjs/common';

import { ConfigService, typeOrmFeaturesFactory } from '@shared';
import { JwtService } from '@nestjs/jwt';
import { DislikeService } from './dislike.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DislikeController } from './dislike.controller';

@Module({
	controllers: [DislikeController],
	imports: [TypeOrmModule.forFeature(typeOrmFeaturesFactory(['Dislike', 'Video', 'User', 'Comment']))],
	providers: [ConfigService, JwtService, DislikeService],
})
export class DislikeModule {}
