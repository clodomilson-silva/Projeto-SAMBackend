import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateAttendanceNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  optionTags?: string[];
}
