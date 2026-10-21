import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DocumentItemDto {
  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  igv: number;

  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  productId?: string;
}

export class CreateDocumentDto {
  @IsString()
  @IsIn(['BOLETA', 'FACTURA', 'RECIBO'])
  documentType: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerDocument?: string;

  @IsOptional()
  @IsString()
  customerDocumentType?: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  igv: number;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentItemDto)
  items: DocumentItemDto[];
}
