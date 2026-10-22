import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtSubscriptionGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. Validar token JWT
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Debes iniciar sesión para realizar esta acción');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });
      
      // 2. Poner el usuario en el request (como lo hacía JwtAuthGuard)
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        companyId: payload.companyId,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // 3. Los SUPER_ADMIN nunca se bloquean
    if (request.user.role === 'SUPER_ADMIN') {
      return true;
    }

    // 4. Verificar estado de suscripción en tiempo real
    try {
      const result = await this.dataSource.query(
        `SELECT status, subscription_end_date FROM "company" WHERE id = $1`,
        [request.user.companyId]
      );

      const company = result[0];

      if (company?.status === 'SUSPENDED') {
        throw new ForbiddenException({ 
          message: 'Suscripción suspendida', 
          code: 'SUBSCRIPTION_SUSPENDED' 
        });
      }

      if (company?.subscription_end_date) {
        const today = new Date();
        const endDate = new Date(company.subscription_end_date);
        if (today > endDate && company.status !== 'ACTIVE') {
          throw new ForbiddenException({ 
            message: 'Suscripción vencida', 
            code: 'SUBSCRIPTION_EXPIRED' 
          });
        }
      }
      
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new ForbiddenException('Error al verificar suscripción');
    }
  }
}
