import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {}

@Injectable()
export class AdminGuard {
  canActivate(context: any): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user || user.role !== 'ADMIN') {
      return false
    }
    return true
  }
}

