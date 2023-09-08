import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@entity';
import { ILike, Repository } from 'typeorm';
import { User, UserEdit } from '@shared';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  public async editUser(data: UserEdit): Promise<User> {
    const user = await this.userRepo.findOne({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const password = await bcrypt.hash(data.password, 10);
    const newUser = {
      ...user,
      password: password,
      checkPassword: password,
    };
    Object.assign(user, newUser);
    await this.userRepo.save(user);
    const editedUser = await this.userRepo.findOne({
      where: { email: user.email },
    });
    return { user: editedUser };
  }

  public async deleteUser(username: string) {
    const user = await this.userRepo.findOne({
      where: { username: ILike(username) },
    });
    console.log(username);
    console.log(user);
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    await this.userRepo.remove(user);
  }
}
