import { IsOptional, IsString } from 'class-validator';

export class UpdateComplaintTypeDto {
  @IsString()
  @IsOptional()
  name?: string;
}
