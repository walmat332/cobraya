import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { Product } from './entities/product.entity';
import { Document } from './entities/document.entity';
import { DocumentItem } from './entities/document-item.entity';
import { DocumentSequence } from './entities/document-sequence.entity';
import { Customer } from './entities/customer.entity';

config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Company, Product, Document, DocumentItem, DocumentSequence, Customer],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: { rejectUnauthorized: false }
});
