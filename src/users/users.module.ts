import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import User from './user.entity';
import Address from './address.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([User, Address])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }