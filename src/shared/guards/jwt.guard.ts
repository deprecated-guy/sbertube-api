import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, User } from '@shared';
import { UserRequest } from '../types';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private config: ConfigService,
	) {
		super();
	}
	handleRequest(err: unknown, user: User, info: unknown, context: ExecutionContext) {
		const req: UserRequest = context.switchToHttp().getRequest();
		const userFromReq = req.user;
		return userFromReq;
	}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req = context.switchToHttp().getRequest();
		const token = req.headers.authorization?.split(' ')[1];

		const decoded = this.jwtService.verify(token, {
			secret: this.config.secret,
			ignoreExpiration: true,
		});
		if (decoded) {
			return super.canActivate(context);
		}
	}
}
