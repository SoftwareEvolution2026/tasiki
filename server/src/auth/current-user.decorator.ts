import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthUser } from './jwt.strategy';

/** Injects the authenticated user (set by JwtStrategy) into a handler. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    return request.user;
  },
);
