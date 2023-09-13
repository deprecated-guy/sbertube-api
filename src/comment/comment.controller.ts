import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from "@nestjs/common"
import {JwtGuard, CommentInput} from "@shared";
import {CommentService} from "./comment.service";
import {from, of} from "rxjs";

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {
    }
    @Get()
      getComments() {
        return from(this.commentService.getAll())
    }
    @UseGuards(JwtGuard)
    @Post()
     createComment(@Body() comment: CommentInput) {
        return from(this.commentService.createComment(comment))
    }

    @UseGuards(JwtGuard)
    @Put(':id')
    editComment(@Param('id')id: number, comment: CommentInput) {
        return from(this.commentService.editComment(id, comment))
    }
    @UseGuards(JwtGuard)
    @Delete(':id')
    deleteComment(@Param('id')id: number) {
        return from(this.commentService.delete(id))
    }

}