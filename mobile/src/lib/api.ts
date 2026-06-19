import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { AuthTokens } from '@tasiki/shared';
import { clearTokens, getCachedTokens, saveTokens } from './tokens';

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = axios.create({ baseURL });

/** Called when refresh fails and the session is no longer recoverable. */
let onSessionExpired: (() => void) | null = null;
export function setOnSessionExpired(handler: () => void): void {
  onSessionExpired = handler;
}

// Attach the current access token to every request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getCachedTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

type RetriableConfig = AxiosRequestConfig & { _retried?: boolean };

// On a 401, try the refresh token once, then replay the original request.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const tokens = getCachedTokens();
    const isAuthCall = original?.url?.includes('/auth/');

    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !isAuthCall &&
      tokens?.refreshToken
    ) {
      original._retried = true;
      try {
        const { data } = await axios.post<AuthTokens>(
          `${baseURL}/auth/refresh`,
          { refreshToken: tokens.refreshToken },
        );
        await saveTokens(data);
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };
        return api(original);
      } catch {
        await clearTokens();
        onSessionExpired?.();
      }
    }
    return Promise.reject(error);
  },
);
