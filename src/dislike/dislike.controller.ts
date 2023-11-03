import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DislikeService } from './dislike.service';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtGuard, User } from '@shared';

@Controller('dislike')
export class DislikeController {
	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Post('dislikeVideo/:id')
	async dislikeVideo(@Req() user: User, @Param(':id') id: number) {
		await this.dislikeService.dislikeVideo(user, id);
		return await this.dislikeService.dislikeVideo(user, id);
	}

	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Post('dislikeComment/:commentId')
	dislikeComment(@Req() user: User, @Param('commentId') commentId: number) {
		return this.dislikeService.dislikeComment(user, commentId);
	}

	constructor(private dislikeService: DislikeService) {}
}
