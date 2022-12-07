import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // jwtがリクエストのどこにあるのかを指定しておく
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          // cookieからjwtを抜き出す
          let jwt = null
          if (req && req.cookies) {
            jwt = req.cookies['access_token']
          }
          return jwt
        },
      ]),
      ignoreExpiration: false,                // trueにしておくと有効期限が切れているjwtも有効なものとしてしまう
      secretOrKey: config.get('JWT_SECRET'),  // jwtを生成するのにつかったsecretを指定しておく
    });
  }

  // constructorのsuper内でjwtの検証がされ、正しかった場合にはvalidateメソッドが呼ばれる
  // constructorの時点でjwtとSecretがあるのでpayloadを復元することができる。
  // この復元したpayloadをvalidateメソッドに渡し、sub(userId)からuserを取得する。
  async validate(payload: {sub: number, email: string}) {   // payload -> auth.serviceでjwtを生成するのに使用されたもの
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      }
    })
    delete user.hashedPassword
    return user
  }
}