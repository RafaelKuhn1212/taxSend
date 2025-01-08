import { InjectQueue } from '@nestjs/bullmq';
import {
    ProcessorsDefiner,
    Processor,
    Context,
  } from 'nestjs-agenda-module';
  import { Queue } from 'bullmq';

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
      "paymentLink": item.paymentLinkRefrete,
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
@ProcessorsDefiner()
export class ExampleProcessorsDefiner {
  constructor(
    @InjectQueue('email') private emailQueue: Queue
  ) {}

  @Processor("refrete")
  public async changeCashTimeStatus(
    @Context() context,
  ) {
    const job = context.job;
    
    const done: Function = context.done;

    // job.attrs.data
await startFlowTypebotREFRETE(job.attrs.data, job.attrs.data.id)
    // Your code here
    done();
  }

  @Processor("deleteContact")
  public async deleteContact(
    @Context() context,
  ) {
    const job = context.job;
    
    const done: Function = context.done;

    var myHeaders = new Headers();
myHeaders.append("Api-Token", "f16f54f17a551c608a692ec28daced4b3ae9aca81f0010d6996e5cdcc7276c3366942afc");
myHeaders.append("Cookie", "__cf_bm=0GBjB3A5hbfqp.Iui2VMJPNfXINRbMrTU1NjSby6gO8-1736375066-1.0.1.1-KUcl4Ot_WOit2SgqICG1a2i1MLJzmnqkVyvuaaUgYm78bIlBebLrn6nd4Afiua6vpQmTqJstYsAm5_I2QjK3NQ; PHPSESSID=18f5c6136c9aa3320d81ecc4522705b7; em_acp_globalauth_cookie=3af86266-dbc7-4d9a-95cf-4f6a73a4bc07");

fetch("https://webspy.activehosted.com/api/3/contacts/"+job.attrs.data.customerid, {
  method: 'DELETE',
  headers: myHeaders,
  redirect: 'follow'
})
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

    done();
  }

}