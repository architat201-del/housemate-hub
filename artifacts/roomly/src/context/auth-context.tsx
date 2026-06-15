import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  householdId: number | null;
  memberId: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<AuthUser> => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
