import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: 'USER' })
  role: string; // 'USER', 'SUPER_ADMIN'

  @ManyToOne(() => Company, (company) => company.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  companyId: string;
}
