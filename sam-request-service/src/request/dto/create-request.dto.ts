import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RequestStatus } from './update-request-status.dto';

export enum CourseType {
  APRENDIZAGEM = 'APRENDIZAGEM',
  TECNICO = 'TECNICO',
  QUALIFICACAO = 'QUALIFICACAO',
}

export class CreateRequestDto {
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
  reason!: string;

  @IsString()
  @IsNotEmpty()
  classCode!: string;

  @IsString()
  @IsNotEmpty()
  courseType!: string;

  @IsString()
  @IsOptional()
  courseName?: string;

  @IsString()
  @IsOptional()
  demandDescription?: string;

  @IsString()
  @IsNotEmpty()
  requesterId!: string;

  @IsString()
  @IsOptional()
  unitId?: string;

  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}
