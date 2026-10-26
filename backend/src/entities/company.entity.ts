import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 11 })
  ruc: string;

  @Column()
  razonSocial: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, name: 'commercial_name' })
  commercialName: string;

  @Column({ default: 'DEMO' })
  sunatEnvironment: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @Column({ type: 'varchar', default: 'TRIAL' })
  status: string;

  @Column({ type: 'varchar', default: 'BASICO' })
  plan: string;

  @Column({ name: 'subscription_end_date', type: 'date', nullable: true })
  subscriptionEndDate: Date | null;
}
