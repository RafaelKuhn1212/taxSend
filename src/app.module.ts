import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GetModule } from './get/get.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './cron';

@Module({
  imports: [GetModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService,TasksService
  ],
})
export class AppModule {}
