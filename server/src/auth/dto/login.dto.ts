import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import type { LoginInput } from '@tasiki/shared';

export class LoginDto implements LoginInput {
  @ApiProperty({ example: 'user@tasiki.app' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'hunter2pass' })
  @IsString()
  password!: string;
}
