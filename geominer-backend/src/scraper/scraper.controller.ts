import { Controller, Get } from '@nestjs/common';
import { AmazonScraperService } from './amazon-scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly amazonScraperService: AmazonScraperService) {}

  @Get('amazon')
  async scrapeBestSellers() {
    return this.amazonScraperService.scrapeBestSellers();
  }
}
