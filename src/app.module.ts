import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, jwtSettings, DBConnection } from '@shared';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';

import { DislikeModule } from './dislike/dislike.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { LikeModule } from './like/like.module';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailService } from './email.service';
import * as path from 'path';
dotenv.config();

@Module({
	imports: [
		AuthModule,
		UserModule,
		VideoModule,
		CommentModule,
		ServeStaticModule.forRoot({
			rootPath: path.resolve(process.cwd(), 'static'),
			renderPath: '',
		}),
		JwtModule.register(jwtSettings),
		TypeOrmModule.forRoot(DBConnection),
		MailerModule.forRoot({
			transport: {
				host: '',
				port: 465,
				secure: true,
				sender: '',
				auth: {
					user: '',
					pass: '',
				},
			},
			defaults: {
				from: '"No Reply" <>',
			},
			template: {
				dir: path.resolve(process.cwd(), 'emails'),
				adapter: new PugAdapter(),
			},
		}),
		LikeModule,
		DislikeModule,
	],
	controllers: [AppController],
	providers: [AppService, ConfigService, EmailService],
})
export class AppModule {}
