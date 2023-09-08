import { UserRegister } from './user-register.interface';

export type UserLogin = Omit<UserRegister, 'checkPassword' & 'email'>;
