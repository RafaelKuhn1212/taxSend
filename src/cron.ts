
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { AppService } from './app.service';
import Agenda from 'agenda';
const prisma = new PrismaClient()
@Injectable()
export class TasksService {
  constructor(
    private readonly agenda: Agenda
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 5 * * *',{
    timeZone: 'America/Sao_Paulo'
  })
// @Cron('*/10 * * * * *') // Cron expression for every 10 seconds
  async handleCron() {
    const allPending = await prisma.sentsPending.findMany()
    const appService = new AppService(
      this.agenda
    )
    for (const pending of allPending) {
      console.log(`Processing pending ${allPending.indexOf(pending) + 1} of ${allPending.length}`)
        try {
            await appService.handle(pending.data)
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
