import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt/dist/jwt.service";
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from "../database/config";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dtos";
import { TokenPayload } from "./interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) { }

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword
      });
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPasswordi: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPasswordi, user.password);
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtAccessToken(userId: number) {
    try {
      const payload: TokenPayload = { userId };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
      });
      return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }
    catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    try {
      const payload: TokenPayload = { userId };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
      });
      const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
      return {
        cookie,
        token
      }
    }
    catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const match = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!match) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
}