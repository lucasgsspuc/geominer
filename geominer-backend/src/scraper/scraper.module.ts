// Módulo NestJS
import { Module } from '@nestjs/common';
import { AmazonScraperService } from './amazon-scraper.service';
import { ScraperController } from './scraper.controller';
import { CategoryModule } from 'src/categories/category.module';
import { ProductModule } from 'src/products/product.module';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [AmazonScraperService],
  exports: [AmazonScraperService],
  controllers: [ScraperController],
})
export class ScraperModule {}
