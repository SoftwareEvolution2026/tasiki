import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import type { RefreshInput } from '@tasiki/shared';

export class RefreshDto implements RefreshInput {
  @ApiProperty({ description: 'The refresh token issued at login.' })
  @IsString()
  refreshToken!: string;
}
