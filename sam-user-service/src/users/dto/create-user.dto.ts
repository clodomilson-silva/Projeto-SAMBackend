import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  PSICOLOGA_EDUCACIONAL = 'PSICOLOGA_EDUCACIONAL',
  SUPERVISAO = 'SUPERVISAO',
  GESTAO = 'GESTAO',
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
}
