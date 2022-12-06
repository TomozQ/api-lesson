import { 
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Msg> {    // @Body()としてBodyデコレータを使用することでリクエストのbodyを取得することができる。送られてくるのはAuthDtoで定義しているemailとpassword
    return this.authService.signUp(dto)
  }

  @HttpCode(HttpStatus.OK)    // Nest.jsはPOSTのStatusがOkの場合は全てcreatedの201を返してしまうので200を返したい場合はHttpStatus.OKとする。
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({passthrough: true}) res: Response,
    /**
     * @Res({passthrough: true})
     * NestJSにはスタンダードモードというものがあり、
     * スタンダードモードは返却値を自動でJSONにシリアライズしてくれる。（今回の場合は{message: 'ok'}）
     * ただ
     * 下のようにres.cookieを使用するには、ExpressのResponseを使用しなくてはならない。
     * ExpressのResponseを使用すると自動でシリアライズが無効になってしまう。
     * 
     * スタンダードモードの自動シリアライズとres.cookieの機能を両立するために{passthrough: true}を指定する
     */
  ): Promise<Msg>{
    const jwt = await this.authService.login(dto);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,     // httpsにする必要がある localではfalseにしておかなくてはならない、デプロイ時にはtrueにする
      sameSite: 'none',
      path: '/',
    })

    return {
      message: 'ok'
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(
    @Req() req: Request, 
    @Res({passthrough: true}) res: Response
  ): Msg {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/'
    })

    return {
      message: 'ok',
    }
  }
}
