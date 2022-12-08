import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import validationSchema from './config/validations.config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({ validationSchema }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
