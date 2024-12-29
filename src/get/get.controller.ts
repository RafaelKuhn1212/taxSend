import { Controller, Get, Query, HttpCode } from '@nestjs/common';
import { GetService } from './get.service';



@Controller('get')
export class GetController {
  constructor(private readonly getService: GetService) {}

  // @Get("/transactions")
  // findAll(
  //   @Query('field') field: string,
  //   @Query('value') value: string,
  //   @Query('token') token: string,
  //   @Query('limit') limit: string,
  //   @Query ('skip') skip: string,
  //   @Query("type") type: string
  // ) {
  //   if(token != "SVLvsMb7TwRqh4PZgwKdbDPwIGmfmQnZ") return "Invalid token";
  //   // @ts-ignore
  //   if(type == "number") value = parseInt(value);
  //   // @ts-ignore
  //   if(field == "id") value = parseInt(value);
  //   return db.collection("transactions").find({[field]: value},{
  //       limit: parseInt(limit || "100"),
  //       skip: parseInt(skip || "0") 
  //   }).toArray();
  // }

  // @Get("/company")
  // findAll2(
  //   @Query('field') field: string,
  //   @Query('value') value: string,
  //   @Query('token') token: string,
  //   @Query('limit') limit: string,
  //   @Query ('skip') skip: string,
  //   @Query("type") type: string
  // ) {
  //   if(token != "SVLvsMb7TwRqh4PZgwKdbDPwIGmfmQnZ") return "Invalid token";
  //   // @ts-ignore
  //   if(type == "number") value = parseInt(value);
  //   // @ts-ignore
  //   if(field == "id") value = parseInt(value);
  //   return db.collection("companies").find({[field]: value},{
  //       limit: parseInt(limit || "100"),
  //       skip: parseInt(skip || "0") 
  //   }).toArray();
  // }

}
