import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import { ProductService } from 'src/products/product.service';

interface AmazonProduct {
  rank: number;
  title: string;
  price: string;
  link: string;
}

function extrairCategoria(str: string): string {
  return str.replace('Mais Vendidos em ', '').trim();
}

@Injectable()
export class AmazonScraperService {
  private readonly logger = new Logger(AmazonScraperService.name);
  private readonly url = 'https://www.amazon.com.br/gp/bestsellers';

  constructor(private readonly productsService: ProductService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'scrapeAmazonBestSellers',
    timeZone: 'America/Sao_Paulo',
  })
  async scrapeBestSellers() {
    this.logger.log('Starting Amazon Best Sellers scraping...');
    let browser;
    let products: Record<string, any[]> = {};

    try {
      browser = await puppeteer.launch({
        headless: true,
        slowMo: 50,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
        defaultViewport: null,
        // Opcional: configurar proxy para evitar bloqueios
        // args: ['--proxy-server=your-proxy-server:port']
      });

      const page: puppeteer.Page = await browser.newPage();

      // Configurar user-agent para evitar detecção
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );

      // Acessar a página de best-sellers
      await page.goto(this.url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      const secoes = await page.$$('.a-carousel-container');

      page.on('console', (msg) => {
        for (let i = 0; i < msg.args().length; ++i) {
          this.logger.log(`Browser console: ${msg.args()[i]}`);
        }
      });

      for (let i = 0; i < secoes.length; i++) {
        const secao = secoes[i];
        const nomeCategoria = await page.evaluate((el) => {
          const heading = el.querySelector('h2.a-carousel-heading');
          return heading?.textContent?.trim() || 'Categoria desconhecida';
        }, secao);

        const dado = await extrairProdutosDeCarrossel(secao);
        products[nomeCategoria] = dado;
      }

      // Aqui você pode salvar os dados em um banco de dados ou retornar para o frontend
      // Exemplo: await this.productRepository.save(products);
      return products;
    } catch (error) {
      this.logger.error(`Error during scraping: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
        this.logger.log('Browser closed');
        console.log({ products });
        await this.productsService.seedProducts(products);
      }
    }
  }
}

async function extrairProdutosDeCarrossel(secao: puppeteer.ElementHandle) {
  const produtosSecao: any[] = [];

  while (true) {
    // 1. Extrai os produtos visíveis neste "slide"
    const produtosVisiveis = await secao.$$eval('.a-carousel-card', (cards) => {
      return cards.map((item) => {
        const titleElement = item.querySelector(
          '.p13n-sc-truncated',
        ) as HTMLElement | null;

        const priceElement = item.querySelector(
          '._cDEzb_p13n-sc-price_3mJ9Z',
        ) as HTMLElement | null;
        const linkElement = item.querySelector(
          'a.a-link-normal',
        ) as HTMLAnchorElement | null;
        const imageElement = item.querySelector(
          '.p13n-product-image',
        ) as HTMLImageElement | null;

        const existeTodos =
          titleElement && priceElement && linkElement && imageElement;
        if (!existeTodos) return;

        return {
          title: titleElement?.innerText?.trim() || 'N/A',
          price: priceElement?.innerText?.trim() || 'N/A',
          link: linkElement
            ? `https://www.amazon.com.br${linkElement.getAttribute('href')}`
            : 'N/A',
          image: imageElement ? imageElement.src : 'N/A',
        };
      });
    });

    for (const produto of produtosVisiveis) {
      if (produto) produtosSecao.push(produto);
    }

    // 2. Verifica se estamos na última página
    try {
      const textoPagina = await secao.$eval(
        '.a-carousel-page-count',
        (el) => el.textContent?.trim() || '',
      );
      const match = textoPagina.match(/Página\s+(\d+)\s+de\s+(\d+)/i);
      if (!match) break;

      const atual = parseInt(match[1]);
      const total = parseInt(match[2]);

      if (atual >= total) break;

      // 3. Clica para avançar
      const botao = await secao.$('.a-carousel-goto-nextpage');
      if (!botao) break;

      await botao.click();
      await new Promise((res) => setTimeout(res, 1000)); // Espera novo slide carregar
    } catch {
      break;
    }
  }

  return produtosSecao;
}
