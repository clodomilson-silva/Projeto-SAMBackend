import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum DashboardPeriodType {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export class PsychologistDashboardQueryDto {
  @IsString()
  psychologistId!: string;

  @IsEnum(DashboardPeriodType)
  @IsOptional()
  periodType?: DashboardPeriodType;

  @IsDateString()
  @IsOptional()
  referenceDate?: string;
}
