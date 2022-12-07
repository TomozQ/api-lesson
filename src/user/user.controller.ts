import { 
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * AuthGuardの便利な機能
   * PassportStrategyのvalidateメソッドはjwtを検証したユーザーなのでログインしているユーザーのUserオブジェクトを返すという関数になっている
   * NestJSではこのユーザーオブジェクトを自動的にリクエストに含める機能がある
   * コントローラーではRequestにアクセスできるのでreq.userとしてログインしているユーザーを取得することができる。
   */
  @Get()
  getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    /**
     * 引数で取得しているExpressのRequest型には今回定義しているuserの型は含まれていないので
     * でカスタムで追加する。
     * 今回定義しているユーザーの型
     * ↓
     * User {
     * id: number;
     * createdAt: Date;
     * updatedAt: Date;
     * email: string;
     * hashedPassword: string;
     * nickname: string | null;
     * }
     */
    return req.user
  }

  @Patch()
  updateUser(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>>{
    console.log(req.user?.id)
    console.log(dto)
    return this.userService.updateUser(req.user.id, dto)
  }
}
