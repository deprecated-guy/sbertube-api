import { UserEntity } from '@entity';
import { User } from '../dto';

export interface UserRequest extends Request {
  user: User;
}
