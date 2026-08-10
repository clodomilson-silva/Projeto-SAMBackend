import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateCollectiveInterventionDto {
  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  classCode?: string;

  @IsString()
  @IsOptional()
  course?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetAudience?: string[];

  @IsString()
  @IsOptional()
  unitId?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  instructor?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  eventTime?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  presentPeople?: string[];

  @IsString()
  @IsOptional()
  actionReport?: string;
}
