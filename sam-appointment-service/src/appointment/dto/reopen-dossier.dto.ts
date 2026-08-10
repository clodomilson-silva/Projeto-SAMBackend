import { IsNotEmpty, IsString } from 'class-validator';

export class ReopenDossierDto {
  @IsString()
  @IsNotEmpty()
  createdBy!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
