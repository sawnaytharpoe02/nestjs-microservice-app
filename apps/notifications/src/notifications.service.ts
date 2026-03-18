import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('SMTP_USER'),
        clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
        clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
        refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN')
      }
    })
  }

  async notifyEmail({ email, amount }: NotifyEmailDto) {
    try {
      console.log('Sending payment confirmation email to:', email);
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to: email,
        subject: 'Payment Confirmation',
        text: `Your payment has been confirmed with amount ${amount}`,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error.message);
    }
  }
}
