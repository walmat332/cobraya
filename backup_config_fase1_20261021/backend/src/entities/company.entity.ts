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

  @Column({ default: 'DEMO' }) // DEMO o PROD
  sunatEnvironment: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
