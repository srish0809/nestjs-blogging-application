import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto, userId: number) {
    const res = await this.prisma.post.create({
      data: { content: createPostDto.content, userId: userId },
    });
    return res;
  }

  async findAll() {
    const res = await this.prisma.post.findMany({ include: { comment: true } });
    return res;
  }
}
