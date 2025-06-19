// Módulo NestJS
import { Module } from '@nestjs/common';
import { AmazonScraperService } from './amazon-scraper.service';
import { ScraperController } from './scraper.controller';
import { CategoryModule } from 'src/categories/category.module';
import { ProductModule } from 'src/products/product.module';
import { MercadoLivreScraperService } from './mercado-livre-scraper.service';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [AmazonScraperService, MercadoLivreScraperService],
  exports: [AmazonScraperService, MercadoLivreScraperService],
  controllers: [ScraperController],
})
export class ScraperModule {}
