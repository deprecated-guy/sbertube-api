import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, VideoEntity } from '@entity';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@shared';
import { JwtStrategy } from '../shared/strategies';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VideoEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService, JwtStrategy],
})
export class AuthModule {}
