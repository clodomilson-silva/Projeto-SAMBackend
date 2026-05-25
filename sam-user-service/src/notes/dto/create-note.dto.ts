import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAttendanceNoteDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  requestId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  optionTags?: string[];
}
