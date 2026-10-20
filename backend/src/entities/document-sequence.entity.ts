import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['companyId', 'series'])
export class DocumentSequence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ length: 4 })
  series: string; // B001, F001, T001

  @Column({ length: 20 })
  documentType: string;

  @Column({ default: 0 })
  currentNumber: number;

  @Column({ default: 1 })
  nextNumber: number;
}


