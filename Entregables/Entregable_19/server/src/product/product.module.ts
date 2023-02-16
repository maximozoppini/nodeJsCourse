import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductMongoService } from 'src/shared/product-mongo/product-mongo.service';

@Module({
  providers: [ProductService, ProductMongoService],
  controllers: [ProductController],
})
export class ProductModule {}
