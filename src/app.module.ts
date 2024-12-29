import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GetModule } from './get/get.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './cron';
import { AgendaModule } from 'agenda-nest';
import { ExampleProcessorsDefiner } from './agenda-processor';

@Module({
  imports: [GetModule,
    ScheduleModule.forRoot(),
    AgendaModule.forRoot({
      db: {
        // address: 'mongodb://admin:%40Souumbbk1@185.209.230.133:27017/',
        // collection: 'newIntegration4',
        address: process.env.MONGO_URL,
        collection: 'TaxAgenda',
      },
      processEvery: '15 seconds',
      maxConcurrency: 20,
    }),
  ],
  controllers: [AppController],
  providers: [AppService,TasksService,ExampleProcessorsDefiner
  ],
})
export class AppModule {}
