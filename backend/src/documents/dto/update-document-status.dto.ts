import { IsString, IsIn } from 'class-validator';

export class UpdateDocumentStatusDto {
  @IsString()
  @IsIn(['EMITIDO', 'PENDING', 'ANULADO'])
  status: string;
}
