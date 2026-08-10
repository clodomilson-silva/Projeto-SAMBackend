import { IsOptional, IsString } from 'class-validator';

export class UpdateActionTypeDto {
  @IsString()
  @IsOptional()
  name?: string;
}
