import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseModalityDto {
  @IsString()
  @IsOptional()
  name?: string;
}
