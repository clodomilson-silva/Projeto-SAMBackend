import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  PSICOLOGA_EDUCACIONAL = 'PSICOLOGA_EDUCACIONAL',
  SUPERVISAO = 'SUPERVISAO',
  GESTAO = 'GESTAO',
}

export enum WorkUnit {
  NUTEC = 'NUTEC',
  CEP_SAO_LUIS = 'CEP_SAO_LUIS',
  PA_COHAB = 'PA_COHAB',
  TIMON = 'TIMON',
  BALSAS = 'BALSAS',
  CAXIAS = 'CAXIAS',
  SANTA_INES = 'SANTA_INES',
  IMPERATRIZ = 'IMPERATRIZ',
  ACAILANDIA = 'ACAILANDIA',
  BACABAL = 'BACABAL',
  PINHEIRO = 'PINHEIRO',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @ValidateIf((dto: CreateUserDto) => dto.role === UserRole.PSICOLOGA_EDUCACIONAL)
  @IsString()
  @IsNotEmpty()
  crp?: string;

  @ValidateIf((dto: CreateUserDto) => dto.role === UserRole.SUPERVISAO)
  @IsEnum(WorkUnit)
  workUnit?: WorkUnit;
}
