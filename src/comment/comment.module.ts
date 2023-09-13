import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentEntity, UserEntity, VideoEntity} from "@entity";
import {CommentController} from "./comment.controller";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@shared";
import {CommentService} from "./comment.service";

@Module({
 imports: [
     TypeOrmModule.forFeature([CommentEntity, UserEntity, VideoEntity])
 ],
    controllers: [CommentController],
    providers: [JwtService, ConfigService, CommentService]
})
export class CommentModule {}