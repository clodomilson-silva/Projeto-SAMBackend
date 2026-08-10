import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseModalityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
