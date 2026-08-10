import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseTypeDto {
  @IsString()
  @IsOptional()
  name?: string;
}
