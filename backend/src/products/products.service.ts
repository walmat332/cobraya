import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async findAll(companyId: string): Promise<Product[]> {
    return this.productRepository.find({ where: { companyId }, order: { name: 'ASC' } });
  }

  async findOne(id: string, companyId: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id, companyId } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async create(createProductDto: CreateProductDto, companyId: string): Promise<Product> {
    const product = this.productRepository.create({ ...createProductDto, companyId });
    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto, companyId: string): Promise<Product> {
    const product = await this.findOne(id, companyId);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string, companyId: string): Promise<void> {
    const product = await this.findOne(id, companyId);
    await this.productRepository.remove(product);
  }
}
