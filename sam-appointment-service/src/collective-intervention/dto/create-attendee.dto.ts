import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttendeeDto {
  @IsString()
  @IsNotEmpty()
  participantType!: string; // "INTERNO" | "EXTERNO"

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  role?: string; // "ALUNO", "INSTRUTOR", "SUPERVISOR", "GESTOR", "COLABORADOR" or custom role

  @IsString()
  @IsOptional()
  course?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsBoolean()
  @IsOptional()
  isEmployed?: boolean;

  @IsString()
  @IsOptional()
  workplace?: string;

  @IsBoolean()
  @IsNotEmpty()
  lgpdConsent!: boolean;
}
