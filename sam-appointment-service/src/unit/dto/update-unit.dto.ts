import { IsOptional, IsString } from 'class-validator';

export class UpdateUnitDto {
  @IsString()
  @IsOptional()
  name?: string;
}
