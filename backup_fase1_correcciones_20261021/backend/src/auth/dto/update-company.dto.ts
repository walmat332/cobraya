import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  razonSocial: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(13)
  ruc: string;

  @IsString()
  @MaxLength(50)
  address: string;

  @IsString()
  @MaxLength(50)
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialName?: string;
}
