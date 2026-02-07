import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightsModule } from './flights/flights.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [FlightsModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
