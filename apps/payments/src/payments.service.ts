import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
    apiVersion: "2026-02-25.clover"
  });


  constructor(private readonly configService: ConfigService) { }

  async createCharge({ amount }: CreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card,
    // })


    const payemntIntent = await this.stripe.paymentIntents.create({
      // payment_method: paymentMethod.id,
      // payment_method_types: ['card']
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    })

    return payemntIntent;
  }


}
