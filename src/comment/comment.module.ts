import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { typeOrmFeaturesFactory, typeOrmProvidersFactory } from '@shared';
import { CommentService } from './comment.service';

@Module({
	imports: [TypeOrmModule.forFeature(typeOrmFeaturesFactory(['Comment', 'User', 'Video']))],
	controllers: [CommentController],
	providers: typeOrmProvidersFactory(['JWT', 'Comment', 'Config']),
	exports: [CommentService],
})
export class CommentModule {}
