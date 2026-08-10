import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
