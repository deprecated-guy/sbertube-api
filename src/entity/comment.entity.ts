import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import {VideoEntity} from "./video.entity";

@Entity('comment')
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => UserEntity, (user) => user.comments)
    author: UserEntity
    @ManyToOne(() => VideoEntity, (video) => video.comments)
    commentedVideo: VideoEntity
    @Column()
    title: string
    @Column()
    body: string
}