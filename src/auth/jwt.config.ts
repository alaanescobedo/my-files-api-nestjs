import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt/dist";

export default {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    signOptions: {
      expiresIn: `${configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    },
  }),
} as JwtModuleAsyncOptions;