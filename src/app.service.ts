import { Injectable } from '@nestjs/common';
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
@Injectable()
export class AppService {
  async handle(body:any) {
    if(body.type == "transaction"){
      const transaction = await fetch("https://api.gateway.cashtimepay.com.br/v1/admin/transactions/?id="+body.data.id, {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Authorization": 'Basic '+new Buffer(privateKey+":x").toString('base64'),
    },
    "referrer": "https://app.gateway.cashtimepay.com.br/",
    "method": "GET",
    "mode": "cors"
      });
      let data = (await transaction.json())[0]
      // sk_live_WuFHQbIoHmAZgpIDHn4YBfqGhjFOIOFC9hFNQxO3Oa
      // 85603290

      let isPhysical = data.items.some((item) => item.tangible)

      const isNight = new Date().getHours() >= 22 || new Date().getHours() <= 5
      // const isNight = false
      if(data.status == 'paid' && data.customer?.address?.zipCode && data.paymentMethod == 'pix'){
        if(await prisma.sents.findFirst({
          where: {
            transactionId: data.id
            }
            })){
              return
            }
            
        if(isNight){
          return await prisma.sentsPending.create({
            data: {
              data: data,
            }
          })
        }
        await startFlowTypebotTENF(data, data.id)

        if(isPhysical){
          await startFlowTypebotREFRETE(data, data.id)
        }
        await prisma.sents.create({
          data: {
            data: data,
            transactionId: data.id
          }
        })

      }

    }
  }
}
