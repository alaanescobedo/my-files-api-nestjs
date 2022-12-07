import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { validationSchema } from './config';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({ validationSchema }),
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
