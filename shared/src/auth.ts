import type { PublicUser } from './user';

/** Credentials for registering a new account. */
export interface RegisterInput {
  email: string;
  password: string;
}

/** Credentials for logging in. */
export interface LoginInput {
  email: string;
  password: string;
}

/** Body for exchanging a refresh token for a fresh token pair. */
export interface RefreshInput {
  refreshToken: string;
}

/** A short-lived access token + a long-lived refresh token. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Response returned by register / login. */
export interface AuthResponse extends AuthTokens {
  user: PublicUser;
}
