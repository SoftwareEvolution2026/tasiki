import * as SecureStore from 'expo-secure-store';
import type { AuthTokens } from '@tasiki/shared';

const ACCESS_KEY = 'tasiki.accessToken';
const REFRESH_KEY = 'tasiki.refreshToken';

// In-memory cache so the axios interceptors stay synchronous-friendly.
let cache: AuthTokens | null = null;

export async function loadTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
  ]);
  cache = accessToken && refreshToken ? { accessToken, refreshToken } : null;
  return cache;
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  cache = tokens;
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  cache = null;
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
}

export function getCachedTokens(): AuthTokens | null {
  return cache;
}
