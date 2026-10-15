import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-github2'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID') || 'placeholder',
      clientSecret: configService.get('GITHUB_CLIENT_SECRET') || 'placeholder',
      callbackURL: configService.get('GITHUB_CALLBACK_URL') || 'http://localhost:3001/api/auth/github/callback',
      scope: ['user:email'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile
    const user = {
      provider: 'github',
      providerUserId: id,
      email: emails?.[0]?.value || `${id}@github.com`,
      name: displayName || profile.username,
      avatar: photos?.[0]?.value,
      accessToken,
    }
    done(null, user)
  }
}
