import { Body, Controller, Delete, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard, LikeRequest, User } from '@shared';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { DislikeService } from './dislike.service';

@Controller('dislike')
export class DislikeController {
	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Post()
	async addDislike(@Req() user: User, @Body() dislikeInput: LikeRequest) {
		return await this.LikeService.createDislike(user, dislikeInput);
	}

	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Delete('comment/:commentId')
	removeLikeFromComment(@Req() user: User, @Param('commentId') commentId: number, @Query('likeId') likeId: number) {
		return this.LikeService.removeDislikeFromComment(user, commentId, likeId);
	}

	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Delete('video/:videoId')
	removeLikeFromVideo(@Req() user: User, @Param('videoId') videoId: number, @Query('likeId') likeId: number) {
		return this.LikeService.removeDislikeFromVideo(user, videoId, likeId);
	}

	constructor(private LikeService: DislikeService) {}
}
