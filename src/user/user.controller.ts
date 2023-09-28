import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get()
  getAllUser() {

    return this.userService.getAllUser()

  }


  @UseGuards(JwtGuard)
  @Get(':id')
  getUserById(@Param('id') userId: string) {

    return this.userService.getUserById(userId)

  }

}
