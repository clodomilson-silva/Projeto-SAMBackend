import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { DossierStatus } from './update-dossier-status.dto';
import { CourseType } from './upsert-dossier.dto';

export class UpdateDossierDto {
  @IsOptional()
  @IsString()
  psychologistId?: string;

  @IsOptional()
  @IsDateString()
  requestDate?: string;

  @IsOptional()
  @IsDateString()
  attendanceStartDate?: string | null;

  @IsOptional()
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
  @IsString()
  pendingIssues?: string | null;

  @IsOptional()
  @IsEnum(DossierStatus)
  status?: DossierStatus;
}
