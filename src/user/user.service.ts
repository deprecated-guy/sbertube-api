import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, VideoEntity } from '@entity';
import { ILike, Repository } from 'typeorm';
import { User, UserEdit } from '@shared';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(VideoEntity) private videoRepo: Repository<VideoEntity>,
  ) {}

  public async editUser(data: UserEdit): Promise<User> {
    const user = await this.userRepo.findOne({
      where: {
        email: data.email,
      },
      relations: ['videos'],
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
      relations: ['videos'],
    });
    return this.makeDto(editedUser);
  }

  public async deleteUser(userData: User) {
    const user = await this.userRepo.findOne({
      where: { id: userData.user.id },
      relations: ['videos'],
    });
    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    user.videos.map((video) => this.videoRepo.remove(video));
    await this.userRepo.remove(user);
  }

  private makeDto(user: UserEntity): User {
    const dto = user;
    delete dto.checkPassword;
    delete dto.id;
    return {
      user: dto,
    };
  }
  public async getOneUserByUsername(username: string) {
    const user = await this.userRepo.findOne({
      where: {
        username,
      },
      relations: ['videos'],
    });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return this.makeDto(user);
  }
  public async getCurrentUser(userData: User) {
    const user = await this.userRepo.findOne({
      where: { id: userData.user.id },
      relations: ['videos'],
    });
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return this.makeDto(user);
  }
}
