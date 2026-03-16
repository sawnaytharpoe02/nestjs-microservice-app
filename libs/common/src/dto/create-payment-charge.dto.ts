import { IsEmail } from "class-validator";
import { CreateChargeDto } from "./create-charge.dto";


export class CreatePaymentChargeDto extends CreateChargeDto{
    @IsEmail()
    email: string;
}