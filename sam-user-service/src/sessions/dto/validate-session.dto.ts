import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ValidateSessionDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  refreshToken!: string;

  @IsString()
  @IsNotEmpty()
  newRefreshToken!: string;

  @IsDateString()
  @IsNotEmpty()
  newExpiresAt!: string;
}
