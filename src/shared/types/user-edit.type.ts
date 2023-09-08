import { UserRegister } from '@shared';

export type UserEdit = Exclude<UserRegister, 'checkPassword' & 'id' & 'token'>;
