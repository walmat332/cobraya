import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { RucService } from './ruc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ruc')
@UseGuards(JwtAuthGuard)
export class RucController {
  constructor(private readonly rucService: RucService) {}

  @Get('consultar')
  async consultar(@Query('ruc') ruc: string, @Req() req: any) {
    if (!ruc || ruc.length !== 11) {
      return { success: false, message: 'RUC debe tener 11 dígitos' };
    }

    // Obtenemos el companyId del usuario autenticado (o usamos 'default' si no existe)
    const companyId = req.user?.companyId || 'default';

    return this.rucService.consultarRUC(ruc, companyId);
  }
}
