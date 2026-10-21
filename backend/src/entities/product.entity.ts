import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'varchar', default: 'PRODUCT' }) // PRODUCT o SERVICE
  type: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  igvIncluded: boolean;
}
