import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Guards a route by requiring a valid access token. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
