import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { DailyAnalytic } from './daily-analytic.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DailyAnalytic])],
    providers: [ScraperService],
    controllers: [ScraperController],
})
export class ScraperModule { }
