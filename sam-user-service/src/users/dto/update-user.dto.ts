import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole, WorkUnit } from './create-user.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ValidateIf(
    (dto: UpdateUserDto) =>
      dto.role === UserRole.PSICOLOGA_EDUCACIONAL || typeof dto.crp !== 'undefined',
  )
  @IsString()
  crp?: string | null;

  @ValidateIf(
    (dto: UpdateUserDto) => dto.role === UserRole.SUPERVISAO || typeof dto.workUnit !== 'undefined',
  )
  @IsEnum(WorkUnit)
  workUnit?: WorkUnit | null;
}
