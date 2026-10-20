import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class DocumentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  documentId: string;

  @Column()
  description: string;

  @Column({ type: 'real' })
  quantity: number;

  @Column({ type: 'real' })
  unitPrice: number;

  @Column({ type: 'real' })
  subtotal: number;

  @Column({ type: 'real' })
  igv: number;

  @Column({ type: 'real' })
  total: number;

  @Column({ nullable: true })
  productId: string;
}
