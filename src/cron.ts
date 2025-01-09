
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { AppService } from './app.service';
import * as Agenda from 'agenda';
import { InjectAgenda } from 'nestjs-agenda-module';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';


const prisma = new PrismaClient()
@Injectable()
export class TasksService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue
  ) {}

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
}
