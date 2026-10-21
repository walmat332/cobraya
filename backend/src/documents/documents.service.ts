import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Document } from '../entities/document.entity';
import { DocumentItem } from '../entities/document-item.entity';
import { DocumentSequence } from '../entities/document-sequence.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(DocumentItem)
    private documentItemRepository: Repository<DocumentItem>,
    @InjectRepository(DocumentSequence)
    private sequenceRepository: Repository<DocumentSequence>,
    private dataSource: DataSource,
  ) {}

  async findAll(companyId: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, companyId: string): Promise<Document> {
    const doc = await this.documentRepository.findOne({
      where: { id, companyId },
    });
    if (!doc) throw new NotFoundException('Documento no encontrado');
    return doc;
  }

  async create(dto: CreateDocumentDto, companyId: string) {
    const series =
      dto.documentType === 'BOLETA'
        ? 'B001'
        : dto.documentType === 'FACTURA'
          ? 'F001'
          : 'R001';

    // Transacción segura. En SQLite, la transacción ya serializa las escrituras.
    // El @Unique en la entidad previene duplicados a nivel de base de datos.
    try {
      const sequence = await this.dataSource.transaction(async (manager) => {
        let seq = await manager.findOne(DocumentSequence, {
          where: { companyId, series },
        });

        if (!seq) {
          seq = manager.create(DocumentSequence, {
            companyId,
            series,
            currentNumber: 0,
            nextNumber: 1,
            documentType: dto.documentType,
          });
        } else {
          seq.currentNumber += 1;
          seq.nextNumber += 1;
        }

        return manager.save(DocumentSequence, seq);
      });

      const subtotal = dto.items.reduce(
        (sum, item) => sum + Number(item.subtotal),
        0,
      );
      const igv = dto.items.reduce((sum, item) => sum + Number(item.igv), 0);
      const total = dto.items.reduce(
        (sum, item) => sum + Number(item.total),
        0,
      );

      const document = this.documentRepository.create({
        companyId,
        documentType: dto.documentType,
        series,
        number: sequence.currentNumber,
        customerName: dto.customerName || 'Cliente Varios',
        customerDocument: dto.customerDocument,
        customerDocumentType: dto.customerDocumentType,
        subtotal,
        igv,
        total,
        status: 'EMITIDO',
      });
      const savedDoc = await this.documentRepository.save(document);

      const items = dto.items.map((item) =>
        this.documentItemRepository.create({
          companyId, // <-- AGREGADO: Campo obligatorio en la entidad
          documentId: savedDoc.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          igv: item.igv,
          total: item.total,
        }),
      );
      await this.documentItemRepository.save(items);

      return {
        ...savedDoc,
        items,
        fullNumber: savedDoc.fullNumber,
      };
    } catch (error) {
      // Si el @Unique falla (muy raro en SQLite por la serialización), lanzamos error claro
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === '23505') {
        throw new ConflictException(
          'Error de concurrencia al generar el correlativo. Intente nuevamente.',
        );
      }
      throw error;
    }
  }

  async getStats(companyId: string) {
    const documents = await this.documentRepository.find({
      where: { companyId },
      order: { createdAt: 'DESC' },
    });

    const totalSales = documents.reduce(
      (sum, doc) => sum + Number(doc.total),
      0,
    );
    const totalDocuments = documents.length;
    const avgTicket = totalDocuments > 0 ? totalSales / totalDocuments : 0;

    const last7Days: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last7Days[dateStr] = 0;
    }

    documents.forEach((doc) => {
      const dateStr = new Date(doc.createdAt).toISOString().split('T')[0];
      if (last7Days.hasOwnProperty(dateStr)) {
        last7Days[dateStr] += Number(doc.total);
      }
    });

    const dailySales = Object.keys(last7Days).map((date) => ({
      date: date.split('-').slice(1).join('/'),
      total: last7Days[date],
    }));

    const byType = { BOLETA: 0, FACTURA: 0, RECIBO: 0 };
    documents.forEach((doc) => {
      if (byType.hasOwnProperty(doc.documentType)) {
        byType[doc.documentType] += 1;
      }
    });

    return {
      totalSales,
      totalDocuments,
      avgTicket,
      dailySales,
      byType,
    };
  }

  async updateStatus(
    id: string,
    status: string,
    companyId: string,
  ): Promise<Document> {
    const doc = await this.findOne(id, companyId);

    // ANULADO es un estado terminal: un comprobante anulado no se vuelve a anular.
    if (doc.status === 'ANULADO' && status === 'ANULADO') {
      throw new ConflictException('El comprobante ya se encuentra anulado');
    }

    doc.status = status;
    return this.documentRepository.save(doc);
  }
}
