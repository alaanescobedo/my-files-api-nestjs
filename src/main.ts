import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ExcludeNullInterceptor } from './utils/exclude-null.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );
  app.useGlobalInterceptors(new ExcludeNullInterceptor())

  app.use(cookieParser());

  const configService = app.get(ConfigService);

  const port = configService.get('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
