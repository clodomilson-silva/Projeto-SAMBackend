import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActionTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
