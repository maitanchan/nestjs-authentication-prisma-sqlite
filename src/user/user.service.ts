import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async getAllUser(): Promise<User[]> {

    const users = await this.prisma.user.findMany()

    users.map(user => delete user.password)

    return users

  }

  async getUserByEmail(email: string): Promise<User> {

    const user = await this.prisma.user.findUnique({ where: { email: email } })

    return user

  }


  async getUserById(userId: string): Promise<User> {

    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    delete user.password

    return user

  }

}
