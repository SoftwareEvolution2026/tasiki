import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import type { CreateTaskInput } from '@tasiki/shared';

export class CreateTaskDto implements CreateTaskInput {
  @ApiProperty({ example: 'Buy milk', minLength: 1, maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;
}
