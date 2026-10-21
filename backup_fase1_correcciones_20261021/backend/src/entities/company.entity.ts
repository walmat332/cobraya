import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  ruc: string;

  @Column()
  razonSocial: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  commercialName: string;

  @Column({ default: 'DEMO' }) // DEMO o PROD
  sunatEnvironment: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
