import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
var privateKey = "admin_live_YuTvvox0zgoqUVsNQLRQovZmS0BW1u"
import * as fs from 'fs'
import { InjectQueue } from '@nestjs/bullmq';
import * as Agenda from 'agenda';
import { BodyDTO } from './body';
import { Queue } from 'bullmq';
var MailChecker = require('mailchecker');

let lastNotifyHour = undefined
let lastNotifyDay = undefined
let lastNotifyVerification = undefined

async function notify(text:string) {
  
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("apikey", "gWlBmXNgZxaezDtx43S1MKZ6o5HDd^4#ZUNlT0gwQMuPqQN3JI");

var raw = JSON.stringify({
  "number": "558293505877",
  "text": text
});


fetch("https://evolutionapi.ads-information.top/message/sendText/rastreou", {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
})
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

async function sendSms(params: any, url: string) {
  // {
  //   "name": "nando6",
  //   "phone": "5551989026300",
  //   "customized_url": "codigoDeRastreio"
  // }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(
    params
  );

  await fetch(url, {
    method: 'POST',
    body: raw,
    redirect: 'follow',
    headers: myHeaders
  })


}

async function verifyEmailService(email) {

  const response = await fetch(`https://emailverifier.reoon.com/api/v1/verify?email=${email}&key=AdKu20js6MCizcx8qDLQOZxRUICuK5IT&mode=power`, {
    method: 'GET',
    redirect: 'follow'
  })
  const data = await response.json()
  if(response.status == 200){

  return data

 }else{
  const fiveMinutesInMs = 1000 * 60 * 5;

if (lastNotifyVerification && new Date().getTime() - new Date(lastNotifyVerification).getTime() < fiveMinutesInMs) {
  return;
}

  notify("Acabou os creditos do serviço de validação, compra mais, monkey")
  lastNotifyVerification = new Date()
    throw new Error("Erro ao verificar email")
 }

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

      "paymentLink": item.paymentLinkTenf,

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
    ${item.quantity} un. x R$&nbsp;${item.unitPrice / 100}</p>
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
  if (resp.status == 200) {
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
    ${item.quantity} un. x R$&nbsp;${item.unitPrice / 100}</p>
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
  if (resp.status == 200) {
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
var agenda = new Agenda({
  db: {
    // address: "mongodb://admin:%40Souumbbk1@185.209.230.133:27017/",
    // collection: 'newIntegration4',
    address: process.env.MONGO_URL,
    collection: 'TaxAgenda',
  },
});

const prisma = new PrismaClient()
@Injectable()
export class AppService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue
  ) {
    // emailQueue.add('send email', {},{

    // })
   }

  async  sendEmail(item, codigoRastreio) {
    var myHeaders = new Headers();
  myHeaders.append("Api-Token", "f16f54f17a551c608a692ec28daced4b3ae9aca81f0010d6996e5cdcc7276c3366942afc");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=9655db0c3b813ba56fd77176720465dd; cmp1003185588=198bccbdf941da440d378a5ed3ab0fed; em_acp_globalauth_cookie=a1ecc27f-eec4-4e1d-8f82-f30e463cf7d4; PHPSESSID=f54fbbf0451d8c3c0409ebe5b1918b37; em_acp_globalauth_cookie=6f398659-edf7-469d-9876-45b7ff76b2f6");
  const payment = `${item.paymentLinkTenf}?name=${item.customer.name}&document=${item.customer.document.number}&email=${item.customer.email}&telephone=${item.customer.phone}` 
  var raw = JSON.stringify({
    "contact": {
      "email": item.customer.email,
      "firstName": item.customer.name,
      "lastName": "",
      "phone": item.customer.phone,
      "fieldValues": [
        { field: '5', value: item.items.map((item) => `<tr><td style="border-collapse: collapse;"></td></tr><tr><td style="border-collapse: collapse; width: 75px;"><img src="https://s3.rastreou.org/cod-rastreio/placeholder.png" style="width:50px; border: 2px solid; border-radius: 10px;"></td><td style="border-collapse: collapse;"><p style="font-size:14px;line-height:20px;margin-top:0;margin-bottom:0;color:#828282"><strong>${item.title}</strong></p><p style="font-size:14px;line-height:20px;margin-top:0;margin-bottom:0;color:#828282">${item.quantity} un. x R$&nbsp;${item.unitPrice / 100}</p></td></tr><tr><td style="border-collapse: collapse;"></td></tr>`).join("") },
        { field: '23', value: `<a href="${payment}" target="_blank" style="padding:10px 15px;display:inline-block;border-radius:7px;text-decoration:none;background:#46c47d;color:#FFF" class="button btn-success ">Emitir Nota Fiscal</a>` },
        { field: '8', value: "TaxaTenf" },
        { field: '9', value: ((item.shipping?.amount / 100 || 0) + 27.99).toString() },
        { field: '10', value: (item.amount / 100).toString() },
        { field: '11', value: item.customer.address?.state },
        { field: '12', value: item.customer.address?.street },
        { field: '13', value: new Date().toLocaleTimeString() },
        { field: '14', value: `https://s3.rastreou.org/cod-rastreio/sas.png` },
        { field: '15', value: new Date().toLocaleDateString() },
        { field: '16', value: item.customer?.address?.zipCode || "70872050" },
        { field: '17', value: codigoRastreio },
        { field: '18', value: item.customer.document.number },
        { field: '19', value: item.customer.phone },
        { field: '20', value: item.customer.name },
        { field: '21', value: item.customer.email }
      ]
    }
  });
  
  
  
  const resp = await fetch("https://webspy.api-us1.com/api/3/contacts", {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  })
  const data = await resp.json()
  const id = data.contact.id
  
  var myHeaders = new Headers();
  myHeaders.append("Api-Token", "f16f54f17a551c608a692ec28daced4b3ae9aca81f0010d6996e5cdcc7276c3366942afc");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "PHPSESSID=9655db0c3b813ba56fd77176720465dd; cmp1003185588=198bccbdf941da440d378a5ed3ab0fed; em_acp_globalauth_cookie=a8599bed-eaf0-4eab-a1a4-547328ba9d54; PHPSESSID=f54fbbf0451d8c3c0409ebe5b1918b37; em_acp_globalauth_cookie=be0d5f13-5a76-4d75-86a2-af34c3b5ede7");
  
  var raw = JSON.stringify({
    "contactList": {
      "list": 1,
      "contact": id,
      "status": 1
    }
  });
  
  const resp2 = await fetch("https://webspy.api-us1.com/api/3/contactLists", {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  })
  const data2 = await resp2.json()
  
await agenda.schedule(
              "in 5 minutes",
               'deleteContact', {
                customerid: id
               })
  
  
  }

  async handle(body: BodyDTO, source: string) {

    console.log("body", body.data.id)
    console.log("source", source)
    // @ts-ignore
    if (body.type == "transaction") {
      if(body.data.companyId == 70254){
        console.log("Empresa não permitida")
        return

      }
      let data = body.data
      // @ts-ignore
      data.paymentLinkRefrete = body.paymentLinkRefrete
      // @ts-ignore
      data.paymentLinkTenf = body.paymentLinkTenf
      // sk_live_WuFHQbIoHmAZgpIDHn4YBfqGhjFOIOFC9hFNQxO3Oa
      // 85603290
      if (!data) {
        console.log("Erro ao buscar transação")
        return
      }
      let isPhysical = data.items.some((item) => item.tangible)
      for (let item of data.items) {
        if (item.title && /^[0-9]+ Reais$/.test(item.title)) {
          return
        }
      }
      if(data.customer.email.includes(".gov")){
        return
      }

      const saoPauloTime = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

      // const isNight = saoPauloTime.getHours() >= 23 || saoPauloTime.getHours() <= 6;

      const isNight = false
      if (data.status == 'paid' && data.paymentMethod == 'pix') {
        // if(await prisma.sents.findFirst({
        //   where: {
        //     transactionId: data.id.toString()
        //     }
        //     })){
        //       console.log("Email já enviado hoje")
        //       return
        //     }

        const productsNames = data.items.map((item) => item.title);

        // Query to check if the email was sent today with the same products
        const emailSentToday = await prisma.sents.findMany({
          where: {
            AND: [
              {
                data: {
                  path: ['customer', 'email'],
                  equals: data.customer.email,
                },
              },
              {
                date: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
              },
            ],
          },
        });

        const hasSameProducts = emailSentToday.some((emailRecord) => {
          // @ts-ignore
          const previousProducts = emailRecord.data.items.map((item) => item.title);
          // Compare product titles (you can adjust comparison logic if necessary)
          return previousProducts.length === productsNames.length &&
            previousProducts.every((title, index) => title === productsNames[index]);
        });

        // If email was sent today and products are the same, refuse
        if (emailSentToday.length > 0 && hasSameProducts) {
          console.log("Email já enviado hoje com os mesmos produtos");
          return "Email já enviado hoje com os mesmos produtos";
        }
        if (isNight) {
          console.log("Is night")
          return await prisma.sentsPending.create({
            data: {
              data: body as any,
              source: source
            }
          })
        }
        console.log("Iniciando chat")

        const sendsThisHour = await prisma.sents.count({
          where: {
            date: {
              gte: new Date(new Date().setHours(saoPauloTime.getHours(), 0, 0, 0)),
              lte: new Date(new Date().setHours(saoPauloTime.getHours(), 59, 59, 999)),
            },
          },
        });
        const config = await prisma.config.findFirst()
        if(sendsThisHour > config.maxPerHour){
          console.log("Máximo de envios por hora atingido")
          if (lastNotifyHour && new Date().getTime() - new Date(lastNotifyHour).getTime() < 1000 * 60 * 10) {
            return;
          }
          notify("Máximo de envios por hora atingido")
          lastNotifyHour = new Date()
          return
        }

        const email = data.customer.email

        const verifyEmail = async () => {
          if (email.split('@')[0].length <= 4) {
            return "Menos de 4 caracteres"
          }
          if (!MailChecker.isValid(email)) {
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
          if ((await verifyEmailService(email)).status != "safe") {
            return "ServiceNotSafe"
          }

          return null
        }
        const item = data
        const codigoRastreio = item.id
        // await sendSms({
        //   "phone": item.customer.phone,
        //   "name": item.customer.name,
        //   "customized_url":`${item.paymentLinkTenf}?name=${item.customer.name}&document=${item.customer.document.number}&email=${item.customer.email}&telephone=${item.customer.phone}`
        // },"https://v1.smsfunnel.com.br/integrations/lists/25dcf660-484f-4a18-a323-211ce8cb3d56/add-lead")

        if (await verifyEmail()) {
          console.log("Email recusado")
          await prisma.emailRefused.create({
            data: {
              email: email,
              error: await verifyEmail()
            }
          })
          return
        }
      
        await this.emailQueue.add('send email', {
          to: item.customer.email,
          subject: '[Urgente]: Sua Nota Fiscal Está Disponível – Regularize Hoje Mesmo!',
          template: 'taxa-tenf',
          context: {
              "clientEmail": item.customer.email,
              "clientName": item.customer.name,
              "clientPhone": item.customer.phone,
              "codigoRastreio": codigoRastreio,
              "cep": item.customer?.address?.zipCode || "70872050",
              "data": new Date().toLocaleDateString(),
              "logoUrl": `https://s3.rastreou.org/cod-rastreio/sas.png`,
              "paymentLink": item.paymentLinkTenf,
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
          ${item.quantity} un. x R$&nbsp;${item.unitPrice / 100}</p>
      </td>
      </tr>
      
      <tr>
      <td style="border-collapse: collapse;"></td>
      </tr>
            `
              }).join("\n")
            },
        })

        
        // await this.sendEmail(item, codigoRastreio)

          // await startFlowTypebotTENF(data, data.id)
          // const transaction = await createTransaction(data)
          // await startFlowTypebotRECUPERACAO(transaction, data.id)

          if(isPhysical && data.customer?.address?.zipCode){
            // 3 dias
            // await agenda.schedule(
            //   new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            //    'refrete', data)
            // await startFlowTypebotREFRETE(data, data.id)

          }
          try{
          await prisma.sents.create({
            data: {
              data: data,
              transactionId: data.id.toString(),
              source: source
            }
          })
        }catch(e){
        }

      }

    }
  }
}
