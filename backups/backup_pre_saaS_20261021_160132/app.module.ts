import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { DocumentsModule } from './documents/documents.module';
import { RucModule } from './ruc/ruc.module';
import { Company } from './entities/company.entity';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Customer } from './entities/customer.entity';
import { DocumentSequence } from './entities/document-sequence.entity';
import { Document } from './entities/document.entity';
import { DocumentItem } from './entities/document-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        Company,
        User,
        Product,
        Customer,
        DocumentSequence,
        Document,
        DocumentItem,
      ],
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      ssl: { rejectUnauthorized: false },
    }),
    AuthModule,
    ProductsModule,
    DocumentsModule,
    RucModule,
    TypeOrmModule.forFeature([
      Company,
      User,
      Product,
      Customer,
      DocumentSequence,
      Document,
      DocumentItem,
    ]),
  ],
})
export class AppModule {}
