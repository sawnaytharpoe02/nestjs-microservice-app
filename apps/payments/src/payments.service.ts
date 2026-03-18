import { CreateChargeDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { CreatePaymentChargeDto } from '@app/common/dto/create-payment-charge.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationClient: ClientProxy,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: "2024-12-18.acacia" as any, // Trying a known latest version or just remove it if this fails
    });
  }

  async createCharge({ email, amount }: CreatePaymentChargeDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        confirm: true,
        currency: 'usd',
        payment_method: 'pm_card_visa',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      this.notificationClient.emit('notify_email', { email, amount });

      return paymentIntent;
    } catch (error) {
      console.error('Stripe charge creation failed:', error.message);
      throw error;
    }
  }


}
