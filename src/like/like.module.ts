import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { typeOrmProvidersFactory } from '@shared';

@Module({
	controllers: [LikeController],
	providers: typeOrmProvidersFactory(['JWT', 'Config']),
})
export class LikeModule {}
