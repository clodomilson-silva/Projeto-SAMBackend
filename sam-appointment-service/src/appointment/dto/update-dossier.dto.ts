import { IsArray, IsDateString, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { DossierStatus } from './update-dossier-status.dto';
import { CourseType } from './upsert-dossier.dto';

export class UpdateDossierDto {
  @IsOptional()
  @IsString()
  psychologistId?: string;

  @IsOptional()
  @ValidateIf((_, val) => val !== null && val !== undefined && val !== '')
  @IsDateString()
  requestDate?: string;

  @IsOptional()
  @ValidateIf((_, val) => val !== null && val !== undefined && val !== '')
  @IsDateString()
  attendanceStartDate?: string | null;

  @IsOptional()
  @ValidateIf((_, val) => val !== null && val !== undefined && val !== '')
  @IsDateString()
  attendanceEndDate?: string | null;

  @IsOptional()
  @IsString()
  requesterName?: string;

  @IsOptional()
  @IsString()
  studentName?: string;

  @IsOptional()
  @IsString()
  studentRegistration?: string;

  @IsOptional()
  @IsString()
  classCode?: string;

  @IsOptional()
  @IsEnum(CourseType)
  courseType?: CourseType;

  @IsOptional()
  @IsString()
  demandReport?: string;

  @IsOptional()
  @ValidateIf((_, val) => val !== null && val !== undefined)
  @IsString()
  annotations?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complaintTypologies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedActions?: string[];

  @IsOptional()
  @ValidateIf((_, val) => val !== null && val !== undefined)
  @IsString()
  pendingIssues?: string | null;

  @IsOptional()
  @IsEnum(DossierStatus)
  status?: DossierStatus;

  @IsOptional()
  @IsString()
  courseName?: string;

  @IsOptional()
  @IsString()
  priority?: string;
}

