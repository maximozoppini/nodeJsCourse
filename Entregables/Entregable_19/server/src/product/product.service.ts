import { Injectable } from '@nestjs/common';
import { ProductMongoService } from 'src/shared/product-mongo/product-mongo.service';
import { ProductoDTO } from './dto/product.dto';
import { ProductInterface } from './interface/product.interface';

@Injectable()
export class ProductService {
  constructor(private readonly mongo: ProductMongoService) {}

  async getAll(): Promise<ProductInterface[]> {
    return await this.mongo.getAll();
  }

  async getById(id: string): Promise<ProductInterface> {
    return await this.mongo.getById(id);
  }

  async createProduct(product: ProductoDTO): Promise<ProductInterface> {
    return await this.mongo.createData(product);
  }

  async deleteById(id: string): Promise<ProductInterface> {
    return await this.mongo.deleteById(id);
  }
}
