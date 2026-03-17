import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { PAYMENTS_SERVICE, userDto } from '@app/common';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationRepo: ReservationRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentClient: ClientProxy
  ) { }

  create(createReservationDto: CreateReservationDto, {email, _id:userId}: userDto) {
    return this.paymentClient.send('create_charage', {...createReservationDto.charge, email}).pipe(
      map((res) => {
        console.log('stripe res', res)
        return this.reservationRepo.create({
          ...createReservationDto,
          timestamp: new Date(),
          invoiceId: res.id,
          userId
        });
      })
    )
  }

  async findAll() {
    return await this.reservationRepo.find();
  }

  async findOne(_id: string) {
    return await this.reservationRepo.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return await this.reservationRepo.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return await this.reservationRepo.findOneAndDelete({ _id });
  }
}
