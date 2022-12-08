
import { Body, Controller, Delete, Get, Param, Post, Patch, Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user';
import User from 'src/users/user.entity';
import { FindOneParams } from 'src/utils/id-param';
import { CreatePostDto, UpdatePostDto } from './dtos';
import PostsService from './posts.service';

@Controller('posts')
export default class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) { }

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() post: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.createPost(post, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(@Param() { id }: FindOneParams, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}