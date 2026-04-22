import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseType, RequestPriority } from './create-request.dto';
import { RequestStatus } from './update-request-status.dto';

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  requesterName?: string;

  @IsOptional()
  @IsString()
  studentName?: string;

  @IsOptional()
  @IsString()
  studentRegistration?: string;

  @IsOptional()
  @IsString()
  classCode?: string;

  @IsOptional()
  @IsEnum(CourseType)
  courseType?: CourseType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  demandDescription?: string;

  @IsOptional()
  @IsEnum(RequestPriority)
  priority?: RequestPriority;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @IsString()
  targetPsychologistId?: string | null;
}
