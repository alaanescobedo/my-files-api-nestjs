import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './jwt.config';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [UsersModule, PassportModule, ConfigModule, JwtModule.registerAsync(jwtConfig)],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }