import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class ProductoDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  thumbnail: string;
}
