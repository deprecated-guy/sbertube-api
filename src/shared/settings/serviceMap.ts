import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { VideoService } from '../../video/video.service';
import { CommentService } from '../../comment/comment.service';
import { ConfigService } from '@shared';
import { LikeService } from '../../like/like.service';
import { DislikeService } from '../../dislike/dislike.service';

export const ServiceMap: Map<string, Provider> = new Map<string, Provider>([
	['JWT', JwtService],
	['User', UserService],
	['Video', VideoService],
	['Comment', CommentService],
	['Config', ConfigService],
	['like', LikeService],
	['Dislike', DislikeService],
]);
