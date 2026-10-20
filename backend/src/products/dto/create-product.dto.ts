import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsNumber()
  price: number;

  @IsIn(['PRODUCT', 'SERVICE'])
  type: 'PRODUCT' | 'SERVICE';
}
