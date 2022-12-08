import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import PublicFile from './file-public.entity';
import { FilesService } from './files.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([PublicFile])],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule { }
