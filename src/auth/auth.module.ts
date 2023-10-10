import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, typeOrmFeaturesFactory } from '@shared';
import { JwtStrategy } from '../shared/strategies';

@Module({
	imports: [TypeOrmModule.forFeature(typeOrmFeaturesFactory(['User']))],
	controllers: [AuthController],
	providers: [AuthService, JwtService, ConfigService, JwtStrategy],
})
export class AuthModule {}
