import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RucService } from './ruc.service';
import { RucController } from './ruc.controller';
import { Customer } from '../entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [RucController],
  providers: [RucService],
  exports: [RucService],
})
export class RucModule {}
