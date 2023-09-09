import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserEdit, JwtGuard, User } from '@shared';
import { UserService } from './user.service';
import { UserRequest } from '@shared';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Put()
  @UseGuards(JwtGuard)
  async editUser(@Req() req: Request, @Body() data: UserEdit) {
    return await this.userService.editUser(data);
  }
  @Delete()
  @UseGuards(JwtGuard)
  async deleteUser(@Req() req: UserRequest) {
    return await this.userService.deleteUser(req.user);
  }
  @Get('account')
  @UseGuards(JwtGuard)
  async getCurrentUser(@Req() req: UserRequest) {
    return await this.userService.getCurrentUser(req.user);
  }
  @Get(':username')
  async getUser(@Param('username') username: string) {
    return await this.userService.getOneUserByUsername(username);
  }
}
