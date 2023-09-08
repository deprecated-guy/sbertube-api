import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserEdit, JwtGuard, UserDelete } from '@shared';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Put()
  @UseGuards(JwtGuard)
  async editUser(@Req() req: Request, @Body() data: UserEdit) {
    console.log(data.email);
    return await this.userService.editUser(data);
  }
  @Delete()
  @UseGuards(JwtGuard)
  async deleteUser(@Req() req: Request, @Body() data: UserDelete) {
    console.log(data);
    return await this.userService.deleteUser(data.username);
  }
}
