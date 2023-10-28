import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { ConfigService, typeOrmFeaturesFactory } from '@shared';
import { JwtService } from '@nestjs/jwt';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	controllers: [LikeController],
	imports: [TypeOrmModule.forFeature(typeOrmFeaturesFactory(['Like', 'Video', 'User', 'Comment']))],
	providers: [ConfigService, JwtService, LikeService],
})
export class LikeModule {}
