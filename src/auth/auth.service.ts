import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client';
import { LoginhDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async hash(payload: string) {

    return await bcrypt.hash(payload, 10)

  }

  async register(registerDto: RegisterDto): Promise<User> {

    const user = await this.prisma.user.findUnique({ where: { email: registerDto.email } })

    if (user) {

      throw new HttpException('Email already exist', HttpStatus.CONFLICT)

    }

    const hashPassword = await this.hash(registerDto.password)

    const newUser = await this.prisma.user.create({ data: { ...registerDto, password: hashPassword } })

    delete newUser.password

    return newUser

  }

  async validateUser(loginDto: LoginhDto) {

    const user = await this.userService.getUserByEmail(loginDto.email)

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {

      const { password, ...result } = user

      return result

    }

    throw new UnauthorizedException()

  }

  async signToken(userId: string, email: string) {

    const [access_token, refresh_token] = await Promise.all([

      this.jwtService.signAsync({ id: userId, email }, { secret: 'access_token', expiresIn: '60s' }),

      this.jwtService.signAsync({ id: userId, email }, { secret: 'refresh_token', expiresIn: '7d' }),

    ])

    return { access_token: access_token, refresh_token: refresh_token }

  }

  async login(loginDto: LoginhDto) {

    const user = await this.validateUser(loginDto)

    if (!user) {

      throw new UnauthorizedException()

    }

    const token = await this.signToken(user.id, user.email)

    return { ...user, token }

  }

  async refreshToken(user: User) {

    return await this.signToken(user.id, user.email)

  }

}
