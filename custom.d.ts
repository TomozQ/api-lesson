import { User } from '@prisma/client'

// 標準のExpressのRequestの型に対してuserというフィールドを追加し、内容は今回prismaで定義しているhashedPasswordを除いたUser型としている。
declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<User, 'hashedPassword'>
  }
}