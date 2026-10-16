import { IsString, MinLength, IsOptional } from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @IsOptional()
  name?: string
}

export class LoginDto {
  @IsString()
  email: string // Accepts email, phone number, or username (e.g. phamminhhieu18022004)

  @IsString()
  password: string
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsString()
  @IsOptional()
  avatar?: string
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string

  @IsString()
  @MinLength(6)
  newPassword: string
}

export class ForgotPasswordDto {
  @IsString()
  email: string
}

export class ResetPasswordDto {
  @IsString()
  token: string

  @IsString()
  @MinLength(6)
  newPassword: string
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string
}
