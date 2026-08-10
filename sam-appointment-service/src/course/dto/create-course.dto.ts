import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  unitId?: string;

  @IsString()
  @IsOptional()
  courseTypeId?: string;
}
