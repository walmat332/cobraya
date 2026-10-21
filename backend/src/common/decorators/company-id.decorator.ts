import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // El JwtAuthGuard ya validó el token y adjuntó el usuario al request
    const user = request.user;

    if (!user || !user.companyId) {
      throw new UnauthorizedException(
        'No se pudo determinar la empresa del usuario',
      );
    }

    return user.companyId;
  },
);
