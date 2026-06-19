import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthResponse, PublicUser } from '@tasiki/shared';
import { api, setOnSessionExpired } from './api';
import { clearTokens, loadTokens, saveTokens } from './tokens';

interface AuthContextValue {
  user: PublicUser | null;
  initializing: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(async () => {
    await clearTokens();
    setUser(null);
  }, []);

  // Restore a persisted session on launch.
  useEffect(() => {
    setOnSessionExpired(() => {
      setUser(null);
    });
    (async () => {
      const tokens = await loadTokens();
      if (tokens) {
        try {
          const { data } = await api.get<PublicUser>('/auth/me');
          setUser(data);
        } catch {
          await clearTokens();
        }
      }
      setInitializing(false);
    })();
  }, []);

  const authenticate = useCallback(async (path: string, body: unknown) => {
    const { data } = await api.post<AuthResponse>(path, body);
    await saveTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    setUser(data.user);
  }, []);

  const register = useCallback(
    (email: string, password: string) =>
      authenticate('/auth/register', { email, password }),
    [authenticate],
  );

  const login = useCallback(
    (email: string, password: string) =>
      authenticate('/auth/login', { email, password }),
    [authenticate],
  );

  const value = useMemo(
    () => ({ user, initializing, register, login, logout }),
    [user, initializing, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
