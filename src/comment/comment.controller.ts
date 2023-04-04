import { Controller } from '@nestjs/common';
import { Body, Post, Request, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport/dist';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  userService: any;
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentService.create(createCommentDto, req.user.id);
  }
}
