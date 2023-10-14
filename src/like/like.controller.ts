import { Body, Controller, Delete, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard, LikeRequest, User } from '@shared';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Post()
	async addLike(@Req() user: User, @Body() likeInput: LikeRequest) {
		return await this.LikeService.createLike(user, likeInput);
	}

	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Delete('comment/:commentId')
	removeLikeFromComment(@Req() user: User, @Param('commentId') commentId: number, @Query('likeId') likeId: number) {
		return this.LikeService.removeLikeFromComment(user, commentId, likeId);
	}
	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Delete('video/:videoId')
	removeLikeFromVideo(@Req() user: User, @Param('videoId') videoId: number, @Query('likeId') likeId: number) {
		return this.LikeService.removeLikeFromVideo(user, videoId, likeId);
	}

	constructor(private LikeService: LikeService) {}
}
