import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectiveInterventionDto {
  @IsString()
  @IsNotEmpty()
  theme!: string;

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
  @IsNotEmpty()
  instructor!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsOptional()
  eventTime?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  presentPeople?: string[];

  @IsString()
  @IsNotEmpty()
  actionReport!: string;
}
