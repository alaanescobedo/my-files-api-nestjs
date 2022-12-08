import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dtos/';
import { PostNotFoundException } from './exceptions';
import Post from './post.entity';

@Injectable()
export default class PostsService {

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>
  ) { }

  getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author']
    });
    if (!post) throw new PostNotFoundException(id);
    return post;
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = this.postsRepository.create({
      ...post,
      author: user
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({
      where: { id },
      relations: ['author']
    });
    if (!updatedPost) throw new PostNotFoundException(id);
    return updatedPost
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) throw new PostNotFoundException(id);
  }
}