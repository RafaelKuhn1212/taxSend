
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { AppService } from './app.service';
const prisma = new PrismaClient()
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 5 * * *')
// @Cron('*/10 * * * * *') // Cron expression for every 10 seconds
  async handleCron() {
    const allPending = await prisma.sentsPending.findMany()
    const appService = new AppService()
    for (const pending of allPending) {
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
