import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import * as mongodb from 'mongodb'
import * as Minio from 'minio'
import { PrismaClient } from '@prisma/client';
import { Five } from './royalty';
import { BodyDTO, nota_fiscal_config } from './body';

const prisma = new PrismaClient()
export const sources = [
  {
    "name": "cashtime",
    "paymentLinkTenf": "https://pay.br-envio.lat/1VOvGVroo15GD62",
    "paymentLinkRefrete":"https://pay.paguesafe.lat/VroegNjXJAYgKwj"
  },
  {
   "name": "fivepagamentos",
   "paymentLinkTenf": "https://pay.br-oficial.site/PVYB34kRw81gKzk",
   "paymentLinkRefrete":"https://pay.paguesafe.lat/VroegNjXJAYgKwj"
  },
  {
    "name": "royalfy",
    "paymentLinkTenf": "https://pay.br-envio.lat/1VOvGVroo15GD62",
    "paymentLinkRefrete":"https://pay.paguesafe.lat/VroegNjXJAYgKwj"
  },
  {
    "name": "summit",
    "paymentLinkTenf": "https://pay.paguesafe.org/meABG99WD6LG6Ea",
    "paymentLinkRefrete":"https://pay.paguesafe.lat/VroegNjXJAYgKwj"
  },
  {
    "name": "paguesafe",
    "paymentLinkTenf": "https://pay.oficial-br.lat/ODAK3LEmoxDZE6V",
    "paymentLinkRefrete":"https://pay.paguesafe.lat/VroegNjXJAYgKwj"
  },
  {
    "name": "zyon",
    "paymentLinkTenf": "https://pay.br-oficial.site/PVYB34kRw81gKzk",
    "paymentLinkRefrete":"https://pay.paguesafe.lat/VroegNjXJAYgKwj"
  }
]
const isSource = (source) => {
  return sources.map((source) => source.name).includes(source)
}


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // Set status to 200
  @Post()
  @HttpCode(201)
  async getHello(@Body() body: any, 
  @Query('source') sourceP: string,
  ) {
    // @ts-ignore

    if(sourceP == undefined || sourceP == null || sourceP == "") sourceP = 'fivepagamentos'
    console.log(sourceP)
    if(!isSource(sourceP)) return "Invalid source"
    const {
      paymentLinkRefrete,
      paymentLinkTenf
    } = sources.find((source) => source.name == sourceP)
    body.paymentLinkTenf = paymentLinkTenf
    body.paymentLinkRefrete = paymentLinkRefrete
    switch(sourceP){
      case "cashtime":
        return await this.appService.handle(body,sourceP)
      case "fivepagamentos":
       return await this.appService.handle(body,sourceP)
      case "summit":
        return await this.appService.handle(body,sourceP)
      case "paguesafe":
        return await this.appService.handle(body,sourceP)
      case "zyon":
        return await this.appService.handle(body,sourceP)
      case "royalfy":
        return await this.appService.handle(
          RolatyToBody(body),
          sourceP)
    }
  }

  @Post("abandoned")
  @HttpCode(201)
  async getAbandoned(@Body() body: any, 
  @Query('source') sourceP: string,
  ){
    
    if(sourceP == undefined || sourceP == null || sourceP == "") sourceP = 'fivepagamentos'
    if(!isSource(sourceP)) return "Invalid source"
    
    
      await this.appService.handleAbandoned(body,sourceP)
  }
}

function RolatyToBody(body: any): BodyDTO {
  return {
    // @ts-ignore
    paymentLinkTenf: body.paymentLinkTenf,
    paymentLinkRefrete: body.paymentLinkRefrete,
    type: "transaction", // The type is always "transaction" as per the example
    data: {
      id: body.data.id,
      status: body.data.status, // Map the status directly
      paymentMethod: body.data.paymentMethod, // Payment method, like 'pix', 'boleto', etc.
      customer: {
        email: body.data.customer.email,
        name: body.data.customer.name, // Customer's name (optional)
        phone: body.data.customer.phone, // Customer's phone (optional)
        document: {
          number: body.data.customer.docNumber // Document number
        },
        address: {
          zipCode: body.data.address.zipcode, // Map zipCode correctly
          street: body.data.address.street, // Map street
          state: body.data.address.state // Map state
        }
      },
      items: body.data.items.map((item) => ({
        title: item.title,
        unitPrice: item.unitPrice * 100, // Assuming unitPrice is in the correct format (e.g., cents)
        quantity: item.quantity,
        tangible: item.tangible // Optional field for tangible items
      })),
      amount: body.data.amount * 100, // Total transaction amount
      shipping: {
        amount: body.data?.shipping?.amount || 0 // Optional shipping amount, default to 0 if not available
      },
      secureUrl: body.data.checkoutUrl // If the secure URL is the same as the checkoutUrl, it can be mapped here
    }
  };
}
