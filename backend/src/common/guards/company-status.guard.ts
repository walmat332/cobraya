import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CompanyStatusGuard implements CanActivate {
  constructor(private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario, dejar pasar a JwtAuthGuard
    if (!user || !user.companyId) {
      return true;
    }

    // SUPER_ADMIN puede administrar todas las empresas sin restricción
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    try {
      // Consulta en tiempo real al estado de la empresa en BD
      const result = await this.dataSource.query(
        `SELECT status FROM "company" WHERE id = $1`,
        [user.companyId],
      );

      const company = result[0];

      if (!company) {
        throw new ForbiddenException({
          message: 'Empresa no encontrada',
          code: 'COMPANY_NOT_FOUND',
        });
      }

      // Bloquear solo si está SUSPENDED
      if (company.status === 'SUSPENDED') {
        throw new ForbiddenException({
          message: 'Su empresa está suspendida. Contacte al administrador.',
          code: 'COMPANY_SUSPENDED',
        });
      }

      // ACTIVE, TRIAL o cualquier otro estado permiten continuar
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException({
        message: 'Error interno al verificar estado de empresa.',
        code: 'COMPANY_STATUS_CHECK_ERROR',
      });
    }
  }
}
