import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@shared';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';
dotenv.config();
@Module({
	imports: [
		AuthModule,
		UserModule,
		VideoModule,
		CommentModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'static'),
		}),
		JwtModule.register({
			secretOrPrivateKey: process.env.SECRET,
			global: true,
			signOptions: {
				expiresIn: process.env.EXPIRES_IN,
			},
		}),
		TypeOrmModule.forRoot({
			database: 'freedb_sbertube',
			type: 'mysql',
			username: 'freedb_sbertube',
			password: 'akJs@GN4KwNm&tS',
			host: 'sql.freedb.tech',
			port: 3306,
			entities: ['dist/**/*.entity.js'],
			synchronize: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService, ConfigService],
})
export class AppModule {}
