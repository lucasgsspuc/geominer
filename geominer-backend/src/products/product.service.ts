import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async seedProducts(products: Record<string, any[]>) {
    for (const [categoriaCompleta, itens] of Object.entries(products)) {
      // 1. Extrai a categoria ("Moda", "Cozinha", etc)
      const categoriaNome = categoriaCompleta
        .replace('Mais Vendidos em ', '')
        .trim();

      console.log({ categoriaNome });
      // 2. Busca (ou cria) a categoria no banco
      let categoria = await this.prisma.category.findUnique({
        where: { name: categoriaNome },
      });

      if (!categoria) {
        categoria = await this.prisma.category.create({
          data: { name: categoriaNome },
        });
      }

      // 3. Itera sobre os produtos da categoria
      for (const item of itens) {
        const preco = parseFloat(
          item.price
            .replace('R$', '')
            .replace(/\./g, '')
            .replace(',', '.')
            .trim(),
        );

        try {
          await this.prisma.product.create({
            data: {
              title: item.title,
              price: preco,
              provider: 'AMAZON', // você pode dinamizar isso se quiser
              categoryId: categoria.id,
              link: item.link,
              image: item.image,
            },
          });
        } catch (err) {
          if (err.code === 'P2002') {
            console.log(`Produto duplicado ignorado: ${item.title}`);
          } else {
            console.error(`Erro ao inserir produto ${item.title}`, err);
          }
        }
      }
    }

    console.log('Seed finalizada com sucesso!');
  }

  create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  findAll() {
    return this.prisma.product.findMany({ include: { category: true } });
  }

  findForHome() {
    return this.prisma.product.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
