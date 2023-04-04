import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { FileuploadController } from './fileupload/fileupload.controller';
import { FileuploadService } from './fileupload/fileupload.service';

@Module({
  imports: [UserModule, PrismaModule, CommentModule, PostModule],
  controllers: [AppController, FileuploadController],
  providers: [AppService, FileuploadService],
})
export class AppModule {}
