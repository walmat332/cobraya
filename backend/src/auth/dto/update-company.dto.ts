import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  Matches,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  razonSocial: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$|^\d{11}$/, {
    message: 'El documento debe tener 8 dígitos (DNI) o 11 dígitos (RUC)',
  })
  ruc: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialName?: string;
}
