import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { CommentEntity, LikeEntity, UserEntity, VideoEntity } from '@entity';

export const featureMap: Map<string, EntityClassOrSchema> = new Map<
	string,
	EntityClassOrSchema
>([
	['Comment', CommentEntity],
	['User', UserEntity],
	['Video', VideoEntity],
	['Like', LikeEntity],
]);
