
import { UsersService } from './users.service';
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CurrentUser } from './decorators/current-user';
import User from './user.entity';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.addAvatar(user.id, file.buffer, file.originalname);
  }
}