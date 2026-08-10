import { IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  unitId?: string | null;

  @IsString()
  @IsOptional()
  courseTypeId?: string | null;
}
