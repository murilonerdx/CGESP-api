import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('CGE Scraping')
@Controller('cge')
export class ScraperController {
    constructor(private readonly scraperService: ScraperService) { }

    @Get('data')
    @ApiOperation({ summary: 'Get all scraped data from CGE' })
    @ApiResponse({ status: 200, description: 'Return all scraped data.' })
    async getData() {
        return this.scraperService.getScrapedData();
    }

    @Get('floods')
    @ApiOperation({ summary: 'Get detailed flood data by date' })
    @ApiResponse({ status: 200, description: 'Return detailed flood info.' })
    async getFloods(@Query('date') date: string) {
        return this.scraperService.getFloodDetails(date);
    }

    @Get('analytics')
    @ApiOperation({ summary: 'Get historical flood analytics' })
    @ApiResponse({ status: 200, description: 'Return historical flood data.' })
    async getAnalytics() {
        return this.scraperService.getAnalytics();
    }
}
