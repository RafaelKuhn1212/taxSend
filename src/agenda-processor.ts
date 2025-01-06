import {
    ProcessorsDefiner,
    Processor,
    Context,
  } from 'nestjs-agenda-module';

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
      "paymentLink": item.paymentLink,
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
  constructor() {}
  

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

}