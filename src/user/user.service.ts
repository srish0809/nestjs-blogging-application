import { Injectable, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { query } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto) {
    const emailUser = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });
    if (emailUser) {
      return 'user already exist';
    }
    const saltrounds = 10;
    const password = await bcrypt.hash(createUserDto.password, saltrounds);
    await this.prisma.user.create({
      data: {
        first_name: createUserDto.firstName,
        last_name: createUserDto.lastName,
        email: createUserDto.email,
        password: password,
      },
    });

    return 'user successfully registered';
  }

  async findAll(email: string, password: string) {
    const User = await this.prisma.user.findFirst({ where: { email: email } });
    if (!User) {
      return 'user not found';
    }

    const result = await bcrypt.compare(password, User.password);
    if (!result) {
      return 'password incorrect';
    }
    return 'successful';
  }

  async findOne(id: number) {
    return await this.prisma.user.findFirst({ where: { id: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.prisma.user.findFirst({ where: { id: id } });
    if (!result) {
      return 'user not found';
    }
    return await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const result = await this.prisma.user.delete({ where: { id: id } });
    return result;
  }

  async login(loginDto: LoginUserDto) {
    console.log('hii');
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });
    console.log(user);

    if (!user) {
      return 'User not Found';
    }

    const result = await bcrypt.compare(loginDto.password, user.password);

    console.log(result);

    if (!result) {
      return 'invalid Credentials';
    }
    const payload = { userId: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: process.env.secret_key,
      }),
    };
  }
}
