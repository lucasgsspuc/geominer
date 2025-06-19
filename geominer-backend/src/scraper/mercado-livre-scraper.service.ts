import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Provider } from '@prisma/client';
import * as puppeteer from 'puppeteer';
import { ProductService } from 'src/products/product.service';

interface MercadoLivreProduct {
  rank: number;
  title: string;
  price: string;
  link: string;
  image: string;
  oldPrice?: string;
  discount?: string;
}

@Injectable()
export class MercadoLivreScraperService {
  private readonly logger = new Logger(MercadoLivreScraperService.name);
  private readonly url = 'https://www.mercadolivre.com.br/mais-vendidos';

  constructor(private readonly productsService: ProductService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'scrapeMercadoLivreBestSellers',
    timeZone: 'America/Sao_Paulo',
  })
  async scrapeBestSellers() {
    this.logger.log('Starting Mercado Livre Best Sellers scraping...');
    let browser;
    let products: Record<string, any[]> = {};

    try {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
        defaultViewport: null,
      });

      const page: puppeteer.Page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );

      await page.goto(this.url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      const secoes = await page.$$('section.dynamic__carousel');

      page.on('console', (msg) => {
        for (let i = 0; i < msg.args().length; ++i) {
          this.logger.log(`Browser console: ${msg.args()[i]}`);
        }
      });

      for (let i = 0; i < secoes.length; i++) {
        const secao = secoes[i];
        const nomeCategoria = await page.evaluate((el) => {
          const heading = el.querySelector('h2.andes-typography');
          return heading?.textContent?.trim() || 'Categoria desconhecida';
        }, secao);

        const dado = await extrairProdutosDeCarrossel(secao, page);
        products[nomeCategoria] = dado;
      }

      return products;
    } catch (error) {
      this.logger.error(`Error during scraping: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        this.logger.log('Browser closed');
        console.log({ products });
        await this.productsService.seedProducts(
          products,
          Provider.MERCADOLIVRE,
        );
      }
    }
  }
}

async function extrairProdutosDeCarrossel(
  secao: puppeteer.ElementHandle,
  page: puppeteer.Page,
) {
  const produtosSecao: MercadoLivreProduct[] = [];

  while (true) {
    const produtosVisiveis = await secao.$$eval(
      '.andes-carousel-snapped__slide',
      (cards) => {
        return cards
          .map((item, index) => {
            const rankElement = item.querySelector(
              '.dynamic-carousel__pill-container--text-best-seller',
            ) as HTMLElement | null;
            const titleElement = item.querySelector(
              'h3.dynamic-carousel__title',
            ) as HTMLElement | null;
            const priceElement = item.querySelector(
              '.dynamic-carousel__price span',
            ) as HTMLElement | null;
            const priceDecimalsElement = item.querySelector(
              '.dynamic-carousel__price-decimals',
            ) as HTMLElement | null;
            const oldPriceElement = item.querySelector(
              '.dynamic-carousel__oldprice',
            ) as HTMLElement | null;
            const discountElement = item.querySelector(
              '.dynamic-carousel__discount',
            ) as HTMLElement | null;
            const linkElement = item.querySelector(
              'a.splinter-link',
            ) as HTMLAnchorElement | null;
            const imageElement = item.querySelector(
              'img.dynamic-carousel__img',
            ) as HTMLImageElement | null;

            if (!titleElement || !priceElement || !linkElement || !imageElement)
              return null;

            let price = priceElement.innerText.replace('R$', '').trim();
            if (priceDecimalsElement) {
              price += `,${priceDecimalsElement.innerText.trim()}`;
            }

            let image = imageElement.getAttribute('src');
            if (
              image ===
              'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
            )
              return null;

            let oldPrice = oldPriceElement?.innerText.replace('R$', '').trim();
            if (oldPrice && priceDecimalsElement) {
              oldPrice += `,${priceDecimalsElement.innerText.trim()}`;
            }

            return {
              rank: rankElement
                ? parseInt(
                    rankElement.innerText.match(/\d+/)?.[0] || `${index + 1}`,
                  )
                : index + 1,
              title: titleElement?.innerText?.trim() || 'N/A',
              price: price || 'N/A',
              oldPrice: oldPrice || undefined,
              discount: discountElement?.innerText?.trim() || undefined,
              link: linkElement?.href || 'N/A',
              image: image || 'N/A',
            };
          })
          .filter((item) => item !== null);
      },
    );

    for (const produto of produtosVisiveis) {
      if (produto) produtosSecao.push(produto);
    }

    try {
      const botao = await secao.$(
        '.andes-carousel-snapped__control--next:not([disabled])',
      );
      if (!botao) break;

      await botao.click();
      await new Promise((res) => setTimeout(res, 1000));
    } catch {
      break;
    }
  }

  return produtosSecao;
}
