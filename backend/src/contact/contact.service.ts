import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import axios from 'axios'
import { ContactDto } from './contact.dto'

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name)

  constructor(private readonly configService: ConfigService) {}

  async sendContactEmail(dto: ContactDto): Promise<{ success: boolean }> {
    const emailJsServiceId = this.configService.get<string>('EMAILJS_SERVICE_ID')
    const emailJsTemplateId = this.configService.get<string>('EMAILJS_TEMPLATE_ID')
    const emailJsPublicKey = this.configService.get<string>('EMAILJS_PUBLIC_KEY')
    const emailJsPrivateKey = this.configService.get<string>('EMAILJS_PRIVATE_KEY')

    if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
      try {
        await axios.post(
          'https://api.emailjs.com/api/v1.0/email/send',
          {
            service_id: emailJsServiceId,
            template_id: emailJsTemplateId,
            user_id: emailJsPublicKey,
            accessToken: emailJsPrivateKey || undefined,
            template_params: {
              name: dto.name,
              email: dto.email,
              subject: dto.subject,
              message: dto.message,
              from_name: dto.name,
              from_email: dto.email,
              reply_to: dto.email,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        this.logger.log(`Email sent successfully via EmailJS: ${dto.email} - ${dto.subject}`)
        return { success: true }
      } catch (err: any) {
        this.logger.warn(`EmailJS send attempt failed: ${err?.response?.data || err?.message}`)
      }
    }

    const smtpHost = this.configService.get<string>('SMTP_HOST')
    const smtpUser = this.configService.get<string>('SMTP_USER')
    const smtpPass = this.configService.get<string>('SMTP_PASS')
    const recipientEmail =
      this.configService.get<string>('CONTACT_RECEIVER') ||
      this.configService.get<string>('RECIPIENT_EMAIL') ||
      smtpUser

    if (!smtpHost || !smtpUser || !smtpPass) {
      this.logger.warn('Neither EmailJS nor SMTP fully configured — contact form submission logged only')
      this.logger.log(`Contact: ${dto.name} <${dto.email}> — ${dto.subject}`)
      return { success: true }
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    })

    await transporter.sendMail({
      from: `"${dto.name}" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: dto.email,
      subject: `[Profile Plus] ${dto.subject}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #6366f1; margin-bottom: 8px;">Tin nhắn mới từ Profile Plus</h2>
          <hr style="border: 1px solid #e2e8f0; margin-bottom: 24px;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 100px;">Họ tên:</td><td style="padding: 8px 0; font-weight: 600;">${dto.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${dto.email}">${dto.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Chủ đề:</td><td style="padding: 8px 0; font-weight: 600;">${dto.subject}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1;">
            <p style="color: #0f172a; white-space: pre-wrap;">${dto.message}</p>
          </div>
        </div>
      `,
    })

    return { success: true }
  }
}
