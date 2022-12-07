import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import validationSchema from './config/validations.config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({ validationSchema }),
    DatabaseModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [AuthController],
})
export class AppModule { }
