import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) { }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto)
    return this.userRepo.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    })
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepo.findOne({ email: createUserDto.email })
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.')
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ email })
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new UnauthorizedException('Credentails are not valid.')
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return await this.userRepo.findOne(getUserDto)
  }

  async findAll() {
    return await this.userRepo.find();
  }
}
