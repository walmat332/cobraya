import { SubscriptionGuard } from '../common/guards/subscription.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
// @UseGuards(SubscriptionGuard) - TEMPORALMENTE DESACTIVADO
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@CompanyId() companyId: string) {
    return this.productsService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.productsService.findOne(id, companyId);
  }

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @CompanyId() companyId: string,
  ) {
    return this.productsService.create(createProductDto, companyId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CompanyId() companyId: string,
  ) {
    return this.productsService.update(id, updateProductDto, companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.productsService.remove(id, companyId);
  }
}


