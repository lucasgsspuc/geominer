import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: { subcategory: true, products: true },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { subcategory: true, products: true },
    });
  }

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
