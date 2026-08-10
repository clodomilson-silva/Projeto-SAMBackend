import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DossierStatus } from './update-dossier-status.dto';

export enum CourseType {
  APRENDIZAGEM = 'APRENDIZAGEM',
  TECNICO = 'TECNICO',
  QUALIFICACAO = 'QUALIFICACAO',
}

export class UpsertDossierDto {
  @IsString()
  @IsNotEmpty()
  requestId!: string;

  @IsString()
  @IsNotEmpty()
  psychologistId!: string;

  @IsDateString()
  requestDate!: string;

  @IsDateString()
  @IsOptional()
  attendanceStartDate?: string;

  @IsDateString()
  @IsOptional()
  attendanceEndDate?: string;

  @IsString()
  @IsNotEmpty()
  requesterName!: string;

  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @IsString()
  @IsNotEmpty()
  studentRegistration!: string;

  @IsString()
  @IsNotEmpty()
  classCode!: string;

  @IsEnum(CourseType)
  courseType!: CourseType;

  @IsString()
  @IsNotEmpty()
  demandReport!: string;

  @IsString()
  @IsOptional()
  annotations?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  complaintTypologies?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  selectedActions?: string[];

  @IsString()
  @IsOptional()
  pendingIssues?: string;

  @IsEnum(DossierStatus)
  @IsOptional()
  status?: DossierStatus;

  @IsString()
  @IsOptional()
  courseName?: string;

  @IsString()
  @IsOptional()
  priority?: string;
}
