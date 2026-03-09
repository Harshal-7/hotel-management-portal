import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getHotels, login as apiLogin, logout as apiLogout } from '../api/client';

type AuthContextValue = {
  isLoggedIn: boolean | null;
  login: (username: string, password: string) => Promise<{ success: true } | { error: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      await getHotels();
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (username: string, password: string) => {
    const result = await apiLogin(username, password);
    if ('success' in result) {
      setIsLoggedIn(true);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
