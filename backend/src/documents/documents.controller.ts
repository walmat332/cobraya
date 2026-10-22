import { SubscriptionGuard } from '../common/guards/subscription.guard';
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../common/decorators/company-id.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard)
@UseGuards(SubscriptionGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // ⚠️ IMPORTANTE: Las rutas específicas van PRIMERO, antes que las dinámicas (:id)

  @Get('stats')
  async getStats(@CompanyId() companyId: string) {
    return this.documentsService.getStats(companyId);
  }

  @Get()
  findAll(@CompanyId() companyId: string) {
    return this.documentsService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.documentsService.findOne(id, companyId);
  }

  @Post()
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @CompanyId() companyId: string,
  ) {
    return this.documentsService.create(createDocumentDto, companyId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentStatusDto,
    @CompanyId() companyId: string,
  ) {
    return this.documentsService.updateStatus(id, updateDto.status, companyId);
  }
}






