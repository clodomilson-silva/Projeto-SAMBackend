import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum RequestPriority {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
}

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

  @IsEnum(CourseType)
  courseType!: CourseType;

  @IsString()
  @IsOptional()
  demandDescription?: string;

  @IsEnum(RequestPriority)
  priority!: RequestPriority;

  @IsString()
  @IsNotEmpty()
  requesterId!: string;

  @IsString()
  @IsOptional()
  unitId?: string;
}
