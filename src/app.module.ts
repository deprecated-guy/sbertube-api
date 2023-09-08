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
import { JwtStrategy } from './shared/strategies';
dotenv.config();
@Module({
  imports: [
    AuthModule,
    UserModule,
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
      database: 'sbertube',
      type: 'mysql',
      username: 'root',
      host: 'localhost',
      port: 3306,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
