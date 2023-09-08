import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, VideoEntity } from '@entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@shared';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VideoEntity])],
  controllers: [UserController],
  providers: [JwtService, ConfigService, UserService],
})
export class UserModule {}
