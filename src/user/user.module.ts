import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity, UserEntity, VideoEntity } from '@entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@shared';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([CommentEntity, UserEntity, VideoEntity])],
	controllers: [UserController],
	providers: [JwtService, ConfigService, UserService],
})
export class UserModule {}
