import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('🛡️ [GUARDIA] Verificando acceso. User:', user?.email, 'Role:', user?.role);

    // 1. Si no hay usuario, ¡BLOQUEAR INMEDIATAMENTE! (Las ventas no son públicas)
    if (!user) {
      console.log('🚫 [GUARDIA] ¡BLOQUEADO! No hay usuario autenticado (falta token).');
      throw new UnauthorizedException('Debes iniciar sesión para realizar esta acción');
    }

    // 2. Los SUPER_ADMIN nunca se bloquean
    if (user.role === 'SUPER_ADMIN') {
      console.log('✅ [GUARDIA] Es SUPER_ADMIN, acceso permitido.');
      return true;
    }

    try {
      // 3. Consulta en TIEMPO REAL a la base de datos
      const result = await this.dataSource.query(
        `SELECT status, subscription_end_date FROM "company" WHERE id = $1`,
        [user.companyId]
      );

      const company = result[0];
      console.log('📊 [GUARDIA] Estado en BD para companyId', user.companyId, ':', company?.status);

      if (company?.status === 'SUSPENDED') {
        console.log('🚫 [GUARDIA] ¡BLOQUEADO! Empresa suspendida.');
        throw new ForbiddenException({ 
          message: 'Suscripción suspendida', 
          code: 'SUBSCRIPTION_SUSPENDED' 
        });
      }

      if (company?.subscription_end_date) {
        const today = new Date();
        const endDate = new Date(company.subscription_end_date);
        if (today > endDate && company.status !== 'ACTIVE') {
          console.log('🚫 [GUARDIA] ¡BLOQUEADO! Fecha vencida.');
          throw new ForbiddenException({ 
            message: 'Suscripción vencida', 
            code: 'SUBSCRIPTION_EXPIRED' 
          });
        }
      }
      
      console.log('✅ [GUARDIA] Acceso permitido.');
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('❌ [GUARDIA] Error inesperado:', error);
      throw new ForbiddenException('Error interno al verificar suscripción.');
      return false;
    }
  }
}


