import { Module } from '@nestjs/common';
import { DislikeController } from './dislike.controller';
import { ConfigService, typeOrmFeaturesFactory } from '@shared';
import { JwtService } from '@nestjs/jwt';
import { DislikeService } from './dislike.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	controllers: [DislikeController],
	imports: [TypeOrmModule.forFeature(typeOrmFeaturesFactory(['Dislike', 'Video', 'User', 'Comment']))],
	providers: [ConfigService, JwtService, DislikeService],
})
export class DislikeModule {}
