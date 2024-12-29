import { Injectable } from '@nestjs/common';
import { CreateGetDto } from './dto/create-get.dto';
import { UpdateGetDto } from './dto/update-get.dto';

@Injectable()
export class GetService {
  create(createGetDto: CreateGetDto) {
    return 'This action adds a new get';
  }

  findAll() {
    return `This action returns all get`;
  }

  findOne(id: number) {
    return `This action returns a #${id} get`;
  }

  update(id: number, updateGetDto: UpdateGetDto) {
    return `This action updates a #${id} get`;
  }

  remove(id: number) {
    return `This action removes a #${id} get`;
  }
}
