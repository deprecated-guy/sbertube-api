import {User, Video} from "@shared";

export interface Comment {
    id: number;
    title: string;
    body: string;
    author: User;
    commentedVideo: Video;
}