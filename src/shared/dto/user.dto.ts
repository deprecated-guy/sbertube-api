import { UserEntity } from '@entity';

export class User {
	user: Omit<UserEntity, 'checkPassword' | 'hash'>;
}
