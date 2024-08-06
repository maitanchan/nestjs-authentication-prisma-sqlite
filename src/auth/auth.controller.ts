import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginhDto } from './dto/login.dto';
import { RefreshJwtGuard } from './guard/refresh.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('register')
  regiter(@Body() registerDto: RegisterDto) {

    return this.authService.register(registerDto)

  }

  @Post('login')
  login(@Body() loginDto: LoginhDto) {

    return this.authService.login(loginDto)

  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  refreshToken(@Request() req: any) {

    return this.authService.refreshToken(req.user)

  }


}
