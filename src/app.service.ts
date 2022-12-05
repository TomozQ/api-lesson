import { Injectable } from '@nestjs/common';

@Injectable()   // 他に注入することができる
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
