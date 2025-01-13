
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { AppService } from './app.service';
import * as Agenda from 'agenda';
import { InjectAgenda } from 'nestjs-agenda-module';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

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
const prisma = new PrismaClient()
@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue
  ) {
    
  }

  @Cron('0 5 * * *',{
    timeZone: 'America/Sao_Paulo'
  })
// @Cron('*/10 * * * * *') // Cron expression for every 10 seconds
  async handleCron() {
    return "Cron job is running";
    const allPending = await prisma.sentsPending.findMany()
    const appService = new AppService(this.emailQueue)
    for (const pending of allPending) {
      console.log(`Processing pending ${allPending.indexOf(pending) + 1} of ${allPending.length}`)
        try {
            await appService.handle(pending.data as any, pending.source)
            await prisma.sentsPending.delete({
                where: {
                  id: pending.id
                }
              })
        } catch (error) {
            
        }
        
    }
  }

  // 11 A.M 11 P.M
  @Cron('0 11,23 * * *',{
    timeZone: 'America/Sao_Paulo'
  })
  async handleCron2(){
    async function gettotal(from,to,secretKey,url){
      const resp = await fetch(url+`/v1/metrics/conversion?&from=${from}&until=${to}`, {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Authorization": 'Basic ' + Buffer.from(secretKey + ":x").toString('base64'),
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Priority": "u=0",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "method": "GET",
    "mode": "cors"
  });
  const json = await resp.json()
  return {
    value: json.total.paid.amount.value/100,
    count: json.total.paid.doc_count
  }
    }
    const date = new Date();

    const from = new Date(
      new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        .setHours(0, 0, 0, 0)
    ).toISOString();
    
    const to = new Date(
      new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        .setHours(23, 59, 59, 999)
    ).toISOString();

    const apelidos = [
      "suco de pneu",
      "memory card",
      "avatar defumado",
      "sombra 3D",
      "charuto de macumba",
      "capa de biblia",
      "combustivel de churrasqueira",
      "ze gotinha da Petrobras",
      "mico Leão queimado",
      "sabonete de mecânico",
      "testiculo de africano",
      "mumia de fita isolante",
      "metade de zebra",
      "oreo sem recheio",
      "enderman do minecraft",
      "inimigo da luz",
      "amigo da escuridão",
      "black out",
      "meianoite",
      "eclipse",
      "pedaço de coco de vaca",
      "tapioca de luto",
      "pretoshina e negrozaki",
      "parachoque da rotam",
      "personagem não desbloqueado",
      "adaptação da netflix",
      "ausente no arcoíris",
      "prêmio de PM",
      "guardanapo de mecânico",
      "lanterna queimada",
      "cotonete de escape",
      "papai noel da angola",
      "o preto de barro e os 7 carvões",
      "picolé de asfalto",
      "lata de macumba",
      "materia escura",
      "50 tons de preto",
      "corretivo de petróleo",
      "cirilo",
      "pelé",
      "unha de mendigo",
      "olaf de barro",
      "judeu cremado",
      "batizado na fogueira de são joão",
      "escondidinho de graxa",
      "raio x sem osso",
      "sofá de couro",
      "super choque",
      "madrugada ambulante",
      "gênio do pote de café "
      ];
  
    const cashValue = await gettotal(from,to,'sk_live_WuFHQbIoHmAZgpIDHn4YBfqGhjFOIOFC9hFNQxO3Oa','https://api.gateway.cashtimepay.com.br')
    const paguesafeValue = await gettotal(from,to,'sk_live_sThYg93FIBMDHGCUPASUGVHm0Q5OEoON7JOpDxWfGK','https://api.paguesafe.io')
    const summitValue = await gettotal(from,to,'sk_live_DurWr46sfHxoHloCcWJNoUH4GKM0bruufuUln49zkI','https://api.conta.summitpagamentos.com')
    const fiveValue = await gettotal(from,to,'sk_live_BqUqmFKFSinzr22AgfiwLZk98hiHbLQV4OpLc94fi2','https://api.fivepayments.com.br')
    const total = cashValue.value + paguesafeValue.value + summitValue.value + fiveValue.value
    const totalLucro = paguesafeValue.value*0.5 + summitValue.value*0.5 + cashValue.value + fiveValue.value*0.5
    const RandomApelido = apelidos[Math.floor(Math.random() * apelidos.length)]

    

    let text = `Olá ${RandomApelido}, aqui está seu relatorio:`
    text+=`----------------------------------------------------------------`
    text+=`\n`
    text+=`\n`
    text+=`Cashtime: ${cashValue.value} R$`
    text+=`\n`
    text+=`Paguesafe: ${paguesafeValue.value} R$`
    text+=`\n`
    text+=`Summit: ${summitValue.value} R$`
    text+=`\n`
    text+=`FivePagamentos: ${fiveValue.value} R$`
    text+=`\n`
    text+=`A soma de todos os valores é de ${total.toFixed(3)} R$`
    text+=`\n`
    text+=`\n`
    text+=`Já que tu não sabe fazer porcentagem, eu fiz pra você: lucro total: ${totalLucro.toFixed(3)} R$`
    text+=`\n`
    text+=`\n`
    text+=`Total de vendas: ${cashValue.count + paguesafeValue.count + summitValue.count + fiveValue.count}`
    text+=`----------------------------------------------------------------`
    notify(text)
    // console.log(text)
  }
}
