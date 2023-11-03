import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { typeOrmFeaturesFactory, typeOrmProvidersFactory } from '@shared';

@Module({
	imports: [TypeOrmModule.forFeature(typeOrmFeaturesFactory(['Comment', 'User', 'Video']))],
	controllers: [CommentController],
	providers: typeOrmProvidersFactory(['Config', 'Comment', 'JWT']),
})
export class CommentModule {}
