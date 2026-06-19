import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { RegisterInput } from '@tasiki/shared';

export class RegisterDto implements RegisterInput {
  @ApiProperty({ example: 'user@tasiki.app' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'hunter2pass', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
