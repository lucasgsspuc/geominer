import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { ScraperModule } from './scraper/scraper.module';
import { ProductModule } from './products/product.module';
import { CategoryModule } from './categories/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    ProductModule,
    CategoryModule,
    ScheduleModule.forRoot(),
    ScraperModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
