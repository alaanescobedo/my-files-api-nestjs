import { Body, Req, Controller, HttpCode, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { CurrentUser } from 'src/users/decorators/current-user';
import User from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos';
import { LocalAuthGuard } from './guards';
import JwtAuthGuard from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { RequestWithUser } from './interfaces';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const atCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const { cookie: rtCookie, token: rtToken } = this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(rtToken, user.id);
    request.res.setHeader('Set-Cookie', [atCookie, rtCookie]);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

}