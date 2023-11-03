import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard, User } from '@shared';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Post('likeVideo/:id')
	async likeVideo(@Req() user: User, @Param(':id') id: number) {
		return await this.likeService.likeVideo(user, id);
	}

	@ApiForbiddenResponse()
	@ApiBearerAuth('Authorization')
	@UseGuards(JwtGuard)
	@Post('likeComment/:commentId')
	async likeComment(@Req() user: User, @Param('commentId') id: number) {
		console.log(await this.likeService.likeComment(user, id));
		return await this.likeService.likeComment(user, id);
	}

	constructor(private likeService: LikeService) {}
}
