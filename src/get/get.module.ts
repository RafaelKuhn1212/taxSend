import { Module } from '@nestjs/common';
import { GetService } from './get.service';
import { GetController } from './get.controller';

@Module({
  controllers: [GetController],
  providers: [GetService],
})
export class GetModule {}
