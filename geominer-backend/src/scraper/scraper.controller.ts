import { Controller, Get } from '@nestjs/common';
import { AmazonScraperService } from './amazon-scraper.service';
import { MercadoLivreScraperService } from './mercado-livre-scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly amazonScraperService: AmazonScraperService,
    private readonly mercadoLivreScraperService: MercadoLivreScraperService,
  ) {}

  @Get('amazon')
  async scrapeBestSellersAmazon() {
    return this.amazonScraperService.scrapeBestSellers();
  }

  @Get('mercadolivre')
  async scrapeBestSellersMercadoLivre() {
    return this.mercadoLivreScraperService.scrapeBestSellers();
  }
}
