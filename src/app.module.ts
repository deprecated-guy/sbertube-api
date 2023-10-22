import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, jwtSettings, serveStaticOptions, DbConnectionAsync } from '@shared';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';

import { LikeModule } from './like/like.module';
import { DislikeModule } from './dislike/dislike.module';
dotenv.config();

@Module({
	imports: [
		AuthModule,
		UserModule,
		VideoModule,
		CommentModule,
		ServeStaticModule.forRoot(serveStaticOptions),
		JwtModule.register(jwtSettings),
		TypeOrmModule.forRootAsync(DbConnectionAsync),
		LikeModule,
		DislikeModule,
	],
	controllers: [AppController],
	providers: [AppService, ConfigService],
})
export class AppModule {}
