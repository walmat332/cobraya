import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class RucService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async consultarRUC(ruc: string, companyId: string) {
    // 1. Buscar en la base de datos de clientes
    const customer = await this.customerRepository.findOne({
      where: { documentNumber: ruc, companyId },
    });

    if (customer) {
      return {
        success: true,
        ruc,
        razonSocial: customer.name,
        source: 'database',
      };
    }

    // 2. Si no existe, devolvemos false para que el usuario lo escriba manualmente
    return {
      success: false,
      message:
        'RUC no encontrado. Por favor, ingrese la razón social manualmente.',
    };
  }
}
