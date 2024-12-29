import { PartialType } from '@nestjs/mapped-types';
import { CreateGetDto } from './create-get.dto';

export class UpdateGetDto extends PartialType(CreateGetDto) {}
