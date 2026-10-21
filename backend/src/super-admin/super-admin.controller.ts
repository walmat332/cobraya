import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('super-admin')
@UseGuards(JwtAuthGuard)
export class SuperAdminController {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Get('companies')
  async getAllCompanies(@Req() req) {
    console.log('🔍 DEBUG SUPER ADMIN - req.user:', req.user);
    if (req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Acceso denegado');
    }
    return this.companyRepo.find({ relations: ['users'] });
  }

  @Patch('companies/:id/status')
  async updateCompanyStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('days') days: number,
    @Req() req
  ) {
    if (req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Acceso denegado');
    }

    const company = await this.companyRepo.findOne({ where: { id } });
    if (!company) throw new Error('Empresa no encontrada');

    company.status = status;
    
    if (status === 'ACTIVE' && days) {
      const currentEnd = company.subscriptionEndDate ? new Date(company.subscriptionEndDate) : new Date();
      currentEnd.setDate(currentEnd.getDate() + days);
      company.subscriptionEndDate = currentEnd;
    }

    return this.companyRepo.save(company);
  }
}

