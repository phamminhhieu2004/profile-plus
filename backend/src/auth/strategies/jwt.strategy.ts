import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

const prisma = new PrismaClient()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'fallback_secret',
    })
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) throw new UnauthorizedException()
    return { id: user.id, email: user.email, role: user.role, name: user.name, avatar: user.avatar }
  }
}
