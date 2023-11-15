import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, User, UserLogin, UserRegister } from '@shared';
import * as bcrypt from 'bcrypt';
import { hexify, randomColorHelper } from '../shared/services/helpers';
import { EmailService } from '../email.service';

@Injectable()
export class AuthService {
	async createUser(userData?: UserRegister) {
		const findByEmail = await this.userRepo.findOne({ where: { email: userData.email } });
		const findedUser = await this.userRepo.findOne({
			where: {
				username: userData.username,
			},
		});

		console.log(userData);

		const payload = {
			username: userData.username,
			email: userData.email,
			password: userData.password,
		};

		const token = this.jwtService.sign(payload, {
			secret: this.config.secret,
		});

		const user = this.userRepo.create(userData);

		if (findedUser || findByEmail) {
			throw new HttpException('This user already registered', HttpStatus.CONFLICT);
		}

		user.password = await bcrypt.hash(user.password, 10);
		user.checkPassword = await bcrypt.hash(user.checkPassword, 10);
		user.token = token;
		user.videos = [];
		user.comments = [];
		user.registerDate = new Date().toISOString();
		user.timeAfterRegister = '';
		user.bannerBackgroundImage = '';
		user.avatarBackgroundImage = '';
		user.activationCode = this.mailService.generateCode();
		user.avatarBackground = hexify(randomColorHelper(103, 255));
		user.bannerBackground = hexify(randomColorHelper(100, 255));

		return this.makeDto(await this.userRepo.save(user));
	}

	async verifyUser(id: number, code: string) {
		const user = await this.userRepo.findOne({ where: { id } });
		console.log(id);
		if (user.activationCode === +code) {
			user.isActivated = true;
			console.log(user);
			return this.makeDto(user);
		} else throw new HttpException('Incorrect code', HttpStatus.BAD_REQUEST);
	}

	async loginUser(userLogin: UserLogin) {
		const user = await this.userRepo
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.videos', 'videos')
			.leftJoinAndSelect('user.likes', 'likes')
			.leftJoinAndSelect('user.likes', 'dislikes')
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
		dto.likes = user.likes;
		dto.isActivated = user.isActivated;
		dto.dislikes = user.dislikes;
		dto.avatarBackground = user.avatarBackground;
		dto.bannerBackground = user.bannerBackground;
		delete dto.checkPassword;

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
		private mailService: EmailService,
	) {}
}
