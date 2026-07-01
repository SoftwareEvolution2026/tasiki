import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { CreateTaskInput } from '@tasiki/shared';

export class CreateTaskDto implements CreateTaskInput {
  @ApiProperty({ example: 'Buy milk', minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'Semi-skimmed, two bottles' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
