import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum RecordVisibility {
  PRIVADO_PSICOLOGA = 'PRIVADO_PSICOLOGA',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
}

export class CreateDossierRecordDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  optionTags?: string[];

  @IsEnum(RecordVisibility)
  @IsOptional()
  visibility?: RecordVisibility;

  @IsUUID()
  @IsNotEmpty()
  createdBy!: string;
}
