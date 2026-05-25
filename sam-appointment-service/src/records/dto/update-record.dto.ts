import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { RecordVisibility } from './create-record.dto';

export class UpdateDossierRecordDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  optionTags?: string[];

  @IsEnum(RecordVisibility)
  @IsOptional()
  visibility?: RecordVisibility;
}
