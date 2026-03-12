import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) { }

  async create(createUserDto: CreateUserDto) {
    return this.userRepo.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    })
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ email })
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new UnauthorizedException('Credentails are not valid.')
    }

    return user;
  }

  async findAll() {
    return await this.userRepo.find();
  }
}
