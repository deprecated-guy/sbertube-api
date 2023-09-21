import { Comment } from '@shared';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentDto {
	@ValidateNested()
	@Type(() => Comment)
	comment: Comment;
}
