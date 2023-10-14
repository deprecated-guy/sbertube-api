import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmFeaturesFactory, typeOrmProvidersFactory } from '@shared';

@Module({
	imports: [TypeOrmModule.forFeature(typeOrmFeaturesFactory(['User', 'Video']))],
	controllers: [UserController],
	providers: typeOrmProvidersFactory(['JWT', 'User', 'Config']),
})
export class UserModule {}
