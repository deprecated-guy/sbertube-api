import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, User, UserLogin, UserRegister } from '@shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	async createUser(userData: UserRegister) {
		const payload = {
			username: userData.username,
			email: userData.email,
			password: userData.password,
		};
		const token = this.jwtService.sign(payload, {
			secret: this.config.secret,
		});

		const user = this.userRepo.create(userData);

		const findedUser = await this.userRepo.findOne({
			where: {
				username: userData.username,
			},
		});

		if (findedUser) {
			throw new HttpException('This user already registered', HttpStatus.CONFLICT);
		}

		user.password = await bcrypt.hash(user.password, 10);
		user.checkPassword = await bcrypt.hash(user.checkPassword, 10);
		user.token = token;
		user.videos = [];
		user.comments = [];

		await this.userRepo.save(user);
		return this.makeDto(user);
	}
	async loginUser(userLogin: UserLogin) {
		const user = await this.userRepo
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.videos', 'videos')
			.where('user.username = :username', { username: userLogin.username })
			.getOne();
		const checkPassword = bcrypt.compare(userLogin.password, user.password);

		if (!user || !checkPassword) {
			throw new HttpException('Invalid username or password', HttpStatus.UNPROCESSABLE_ENTITY);
		}

		return this.makeDto(user);
	}

	private makeDto(user: UserEntity): User {
		const dto = Object.assign({}, user);
		dto.videos = user.videos;
		dto.comments = user.comments;
		delete dto.checkPassword;
		delete dto.id;

		return { user: dto };
	}

	public async validateUserByEmail(email: string): Promise<User> {
		const user = await this.userRepo.findOne({ where: { email } });

		if (!user) throw new HttpException('user Not Found', HttpStatus.NOT_FOUND);

		return { user };
	}

	constructor(
		@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
		private jwtService: JwtService,
		private config: ConfigService,
	) {}
}
