import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductoDTO } from './dto/product.dto';
import { ProductInterface } from './interface/product.interface';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async getAllProducts(): Promise<ProductInterface[]> {
    return this.productService.getAll();
  }

  @Get(':id')
  async getProductById(@Param() id: string): Promise<ProductInterface> {
    return this.productService.getById(id);
  }

  @Post()
  async createProduct(
    @Body() productoDTO: ProductoDTO,
  ): Promise<ProductInterface> {
    console.log(productoDTO);
    return this.productService.createProduct(productoDTO);
  }

  @Delete(':id')
  async deleteProductById(@Param() id: string): Promise<ProductInterface> {
    return this.productService.deleteById(id);
  }
}
