import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { Request } from 'express'
import * as cookieParser from 'cookie-parser'  // jwtトークンのやり取りをクッキーベースで行うのでクライアントのリクエストからクッキーを取り出すのに必要
import * as csurf from 'csurf'  // csrfトークン用

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // class-validator使用につき定義が必要
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))   // whitelist: true -> dtoに含まれない項目例えばnicknameなども含まれた場合、nicknameは省いてくれる
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
  app.use(cookieParser())
  await app.listen(3005);
}
bootstrap();
