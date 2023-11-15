import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { JwtGuard, CommentInput, Comment, CommentDto, UserRequest } from '@shared';
import { CommentService } from './comment.service';
import { from } from 'rxjs';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
	@ApiTags('Get Comment By Id')
	@ApiForbiddenResponse()
	@Get(':id')
	@UsePipes(new ValidationPipe())
	getCommentById(@Param('id') id: number) {
		return from(this.commentService.getById(id));
	}

	@ApiTags('Create Comment')
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiBody({
		type: CommentInput,
	})
	@ApiResponse({
		type: CommentDto,
	})
	@UsePipes(new ValidationPipe())
	@UseGuards(JwtGuard)
	@Post()
	createComment(@Req() req: UserRequest, @Body() comment: CommentInput) {
		const user = req.user;
		return from(this.commentService.createComment(comment, user));
	}

	@ApiTags('Edit Comment By Id')
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiBody({
		type: Comment,
	})
	@ApiResponse({
		type: CommentDto,
	})
	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Put(':id')
	editComment(@Req() req: UserRequest, @Param('id') id: number, comment: CommentInput) {
		return from(this.commentService.editComment(id, comment));
	}

	@ApiTags('Delete Comment')
	@ApiBearerAuth('Authorization')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer Token',
	})
	@ApiForbiddenResponse()
	@UseGuards(JwtGuard)
	@UsePipes(new ValidationPipe())
	@Delete(':id')
	deleteComment(@Req() req: UserRequest, @Param('id') id: number, @Query('videoId') videoId: number) {
		return from(this.commentService.delete(id, videoId));
	}

	@Get(':videoId')
	async getCommentsByVideId(@Param('videoId') videoId: number) {
		return await this.commentService.getByVideoId(videoId);
	}

	constructor(private commentService: CommentService) {}
}
