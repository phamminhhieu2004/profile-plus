import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as nodemailer from 'nodemailer'
import * as crypto from 'crypto'
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto/auth.dto'

const prisma = new PrismaClient()

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── Email/Password Auth ───────────────────────────────────────────────

  async register(dto: RegisterDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Vui lòng cung cấp Email hoặc Số điện thoại để đăng ký')
    }

    if (dto.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: dto.email } })
      if (existingEmail) throw new ConflictException('Email này đã được đăng ký')
    }

    if (dto.phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone: dto.phone } })
      if (existingPhone) throw new ConflictException('Số điện thoại này đã được đăng ký')
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12)
    const user = await prisma.user.create({
      data: {
        email: dto.email || null,
        phone: dto.phone || null,
        password: hashedPassword,
        name: dto.name || (dto.email ? dto.email.split('@')[0] : dto.phone),
        role: 'USER',
      },
    })

    return this.generateTokens(user)
  }

  async login(dto: LoginDto) {
    const identifier = (dto.email || '').trim()
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
          { phone: identifier },
        ],
      },
    })
    if (!user || !user.password) throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác')

    return this.generateTokens(user)
  }

  // ─── OAuth Auth ────────────────────────────────────────────────────────

  async handleOAuthLogin(oauthUser: {
    provider: string
    providerUserId: string
    email: string
    name?: string
    avatar?: string
    accessToken?: string
  }) {
    // Check if this OAuth account already exists
    let oauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: oauthUser.provider,
          providerUserId: oauthUser.providerUserId,
        },
      },
      include: { user: true },
    })

    const adminEmails = [
      'phamminhhieu18022004@gmail.com',
    ]

    if (oauthAccount) {
      // Update access token
      await prisma.oAuthAccount.update({
        where: { id: oauthAccount.id },
        data: { accessToken: oauthUser.accessToken },
      })
      let currentUser = oauthAccount.user
      if (currentUser.email && adminEmails.includes(currentUser.email) && currentUser.role !== 'ADMIN') {
        currentUser = await prisma.user.update({
          where: { id: currentUser.id },
          data: { role: 'ADMIN' },
        })
      }
      return this.generateTokens(currentUser)
    }

    // Check if user exists by email
    let user = await prisma.user.findUnique({ where: { email: oauthUser.email } })

    const targetRole = adminEmails.includes(oauthUser.email) ? 'ADMIN' : 'USER'

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: oauthUser.email,
          name: oauthUser.name,
          avatar: oauthUser.avatar,
          emailVerified: true,
          role: targetRole,
        },
      })
    } else if (adminEmails.includes(user.email || '') && user.role !== 'ADMIN') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      })
    }

    // Link OAuth account
    await prisma.oAuthAccount.create({
      data: {
        userId: user.id,
        provider: oauthUser.provider,
        providerUserId: oauthUser.providerUserId,
        accessToken: oauthUser.accessToken,
      },
    })

    return this.generateTokens(user)
  }

  // ─── Telegram Auth ─────────────────────────────────────────────────────

  async handleTelegramLogin(telegramData: {
    id: string
    first_name: string
    last_name?: string
    username?: string
    photo_url?: string
    hash: string
    auth_date: number
  }) {
    // Verify Telegram hash
    const { hash, ...data } = telegramData
    const botToken = this.configService.get('TELEGRAM_BOT_TOKEN') || ''
    const secretKey = crypto.createHash('sha256').update(botToken).digest()
    const checkString = Object.keys(data)
      .sort()
      .map((k) => `${k}=${(data as any)[k]}`)
      .join('\n')
    const expectedHash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex')

    if (expectedHash !== hash) throw new UnauthorizedException('Invalid Telegram data')

    // Check if auth_date is not too old (5 minutes)
    const authAge = Math.floor(Date.now() / 1000) - data.auth_date
    if (authAge > 300) throw new UnauthorizedException('Telegram auth expired')

    const email = `telegram_${data.id}@telegram.local`
    return this.handleOAuthLogin({
      provider: 'telegram',
      providerUserId: data.id,
      email,
      name: `${data.first_name}${data.last_name ? ' ' + data.last_name : ''}`,
      avatar: data.photo_url,
    })
  }

  // ─── Refresh Token ─────────────────────────────────────────────────────

  async refreshToken(token: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } })
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { token } })
      throw new UnauthorizedException('Refresh token expired or invalid')
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } })
    if (!user) throw new UnauthorizedException('User not found')

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token } })
    return this.generateTokens(user)
  }

  // ─── Forgot/Reset Password ─────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } })
    // Always return success for security (don't reveal if email exists)
    if (!user) return { message: 'If that email exists, a reset link has been sent.' }

    // Invalidate old tokens
    await prisma.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    })

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    await prisma.passwordReset.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`
    if (user.email) {
      await this.sendResetEmail(user.email, user.name || 'User', resetUrl)
    }

    return { message: 'If that email exists, a reset link has been sent.' }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex')

    const resetRecord = await prisma.passwordReset.findUnique({ where: { token: hashedToken } })
    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      throw new BadRequestException('Reset token is invalid or expired')
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12)

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    })

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    })

    // Revoke all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId: resetRecord.userId } })

    return { message: 'Password reset successfully' }
  }

  // ─── Logout ────────────────────────────────────────────────────────────

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    return { message: 'Logged out successfully' }
  }

  // ─── Get Me ────────────────────────────────────────────────────────────

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          select: { provider: true },
        },
      },
    })
    if (!user) throw new NotFoundException('User not found')

    const { password, ...safe } = user
    return safe
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    if (dto.email && dto.email !== user.email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: dto.email, NOT: { id: userId } },
      })
      if (existingEmail) throw new ConflictException('Email đã được sử dụng bởi tài khoản khác')
    }

    if (dto.phone && dto.phone !== user.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: dto.phone, NOT: { id: userId } },
      })
      if (existingPhone) throw new ConflictException('Số điện thoại đã được sử dụng bởi tài khoản khác')
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email || null }),
        ...(dto.phone !== undefined && { phone: dto.phone || null }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar || null }),
      },
    })

    const { password, ...safe } = updated
    return safe
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    if (user.password) {
      const valid = await bcrypt.compare(dto.currentPassword, user.password)
      if (!valid) throw new UnauthorizedException('Mật khẩu hiện tại không chính xác')
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return { success: true, message: 'Đổi mật khẩu thành công!' }
  }

  // ─── Private Helpers ───────────────────────────────────────────────────

  private async generateTokens(user: { id: string; email?: string | null; role: string; [key: string]: any }) {
    const payload = { sub: user.id, email: user.email || '', role: user.role }

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = crypto.randomBytes(40).toString('hex')

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    }
  }

  private async sendResetEmail(email: string, name: string, resetUrl: string) {
    console.log(`\n========================================\n[PASSWORD RESET] For: ${email}\nReset Link: ${resetUrl}\n========================================\n`)

    try {
      const transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: parseInt(this.configService.get('SMTP_PORT') || '587'),
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      })

      await transporter.sendMail({
        from: `"Profile Plus" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: '🔐 Đặt lại mật khẩu - Profile Plus',
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #f8fafc; padding: 40px; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="background: linear-gradient(135deg, #dc2626, #ea580c); width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px;">🔐</div>
              <h1 style="margin: 16px 0 4px; font-size: 24px; background: linear-gradient(135deg, #ef4444, #f97316, #facc15); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Profile Plus</h1>
            </div>
            <h2 style="font-size: 20px; margin-bottom: 12px;">Xin chào, ${name}!</h2>
            <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để tạo mật khẩu mới.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #dc2626, #ea580c); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">Đặt lại mật khẩu</a>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 24px;">⏰ Link này sẽ hết hạn sau <strong>1 giờ</strong>.</p>
            <p style="color: #64748b; font-size: 14px;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
            <hr style="border: none; border-top: 1px solid #1e2633; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 12px; text-align: center;">© 2024 Profile Plus · Mọi quyền được bảo lưu</p>
          </div>
        `,
      })
    } catch (err: any) {
      console.warn(`[AuthService] SMTP failed (${err?.message}). Reset link printed above.`)
    }
  }
}
