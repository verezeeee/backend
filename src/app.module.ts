import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountryService } from './country/country.service';
import { CountryController } from './country/country.controller';

@Module({
  imports: [],
  controllers: [AppController, CountryController],
  providers: [AppService, CountryService],
})
export class AppModule {}
