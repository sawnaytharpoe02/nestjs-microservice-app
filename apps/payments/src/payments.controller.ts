import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';
import { CreatePaymentChargeDto } from '@app/common/dto/create-payment-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @MessagePattern('create_charage')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: CreatePaymentChargeDto) {
    console.log('data', data)
    return await this.paymentsService.createCharge(data)
  }
}
