
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { FindOneParams } from 'src/utils/id-param';
import { CreatePostDto } from './dtos';
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
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}