import { UserEntity } from '@entity';

export interface User {
  user: Omit<UserEntity, 'checkPassword' & 'id'>;
}
