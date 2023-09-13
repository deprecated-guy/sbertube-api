import { User } from '../dto';
import {Comment} from "./comment.interface";

export interface Video {
  id: number;
  title: string;
  body: string;
  shortBody: string;
  path: string;
  author: User;
  comments: Comment[]
}
