import { Body, Controller, Post } from '@nestjs/common';
import { UserLogin } from '@shared';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() body: UserLogin) {
    return this.authService.loginUser(body);
  }
  @Post('register')
  async register(@Body() body: UserLogin) {
    return await this.authService.createUser(body);
  }
}
