import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity, UserEntity, VideoEntity} from "@entity";
import {Repository} from "typeorm";
import {CommentInput} from "../shared/types/comment-input.interface";
import {CommentDto} from "../shared/dto/commant.dto";
import {VideoDto} from "../shared/types/video.dto";
import {User, Video} from "@shared";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity) private commentRepo: Repository<CommentEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
        ) {
    }

    public async getAll() {
        return await this.commentRepo.find()
    }
    public async createComment(comment: CommentInput) {
        const newComment = await this.commentRepo.create(comment);
        const video = await this.videoRepo.findOneBy({id: newComment.commentedVideo.id});
        const author = await this.userRepo.findOneBy({id: newComment.commentedVideo.author.id});
        newComment.commentedVideo = video
        newComment.author = author
        const  savedComment = await this.commentRepo.save(newComment)
        return this.makeDto(await this.commentRepo.findOneBy({id: savedComment.id}))
    }

    public async editComment(id: number, commentData:  CommentInput) {
        const comment = await this.commentRepo.findOneBy({id})
        if (!comment) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        Object.assign(comment, {commentData})
        return this.makeDto(await this.commentRepo.save(commentData))
    }
    public async delete(id: number) {
        const comment = await this.commentRepo.findOneBy({id})
        if (!comment) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        await this.commentRepo.remove(comment)
        return ;
    }


    private makeDto(entity: CommentEntity): CommentDto {
        return {
            comment: {
                id: entity.id,
                title: entity.title,
                body: entity.body,
                commentedVideo: entity.commentedVideo as unknown as Video,
                author: entity.author as unknown as User
            }
        }

    }
}