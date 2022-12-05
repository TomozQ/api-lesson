import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// コントローラー内でAppServiceをインスタンス化しない

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // 注入したいサービスを定義

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
