import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ length: 4 })
  series: string;

  @Column({ type: 'integer' })
  number: number;

  @Column({ length: 20 })
  documentType: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerDocument: string;

  @Column({ nullable: true })
  customerDocumentType: string;

  @Column({ type: 'real' })
  subtotal: number;

  @Column({ type: 'real' })
  igv: number;

  @Column({ type: 'real' })
  total: number;

  @Column({ default: 'EMITIDO' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  get fullNumber(): string {
    return `${this.series}-${this.number.toString().padStart(8, '0')}`;
  }
}

