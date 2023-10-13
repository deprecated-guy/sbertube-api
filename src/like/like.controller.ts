import {
	Body,
	Controller,
	Delete,
	Param,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { JwtGuard, LikeRequest, User } from '@shared';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';

@Controller('like')
export class LikeController {
	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Post()
	addLike(@Req() user: User, @Body() likeInput: LikeRequest) {
		console.log(likeInput);
	}

	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Delete(':commentId')
	removeLikeFromComment(
		@Req() user: User,
		@Param('commentId') commentId: number,
		@Query('likeId') likeId: number,
	) {
		console.log(commentId);
		console.log(likeId);
	}
	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Delete(':videoId')
	removeLikeFromVideo(@Req() user: User, @Param('videoId') videoId: number) {
		console.log(videoId);
	}
}
