import { User } from '../dto';

export interface Video {
  id: number;
  title: string;
  body: string;
  shortBody: string;
  path: string;
  author: User;
}
