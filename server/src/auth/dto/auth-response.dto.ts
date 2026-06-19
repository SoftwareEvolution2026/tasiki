import { ApiProperty } from '@nestjs/swagger';
import type { AuthResponse, AuthTokens, PublicUser } from '@tasiki/shared';

export class PublicUserDto implements PublicUser {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'user@tasiki.app' })
  email!: string;

  @ApiProperty()
  createdAt!: string;
}

export class AuthTokensDto implements AuthTokens {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}

export class AuthResponseDto extends AuthTokensDto implements AuthResponse {
  @ApiProperty({ type: PublicUserDto })
  user!: PublicUserDto;
}
