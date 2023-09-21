import { ValidateNested } from 'class-validator';
import { Video } from '@shared';

export class VideoDto {
	@ValidateNested()
	video: Video;
}
