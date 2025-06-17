import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem("auth_token")
  );
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        throw new Error("Authentication failed");
      }
      const data = await response.json();
      return data.user;
    },
    retry: false
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("auth_token", newToken);
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.setItem("logout_state", "true");
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    // Redirecionar para a página inicial após logout
    window.location.href = '/';
  };

  // Sistema de logout funcional - verifica se foi feito logout manual
  const wasLoggedOut = localStorage.getItem('logout_state') === 'true';
  const isInReplit = window.location.hostname.includes('replit') || window.location.hostname.includes('repl');
  
  // Se foi feito logout manual, manter deslogado até login manual
  if (wasLoggedOut) {
    const value: AuthContextType = {
      user: null,
      token: null,
      isLoading: false,
      login: (newToken: string, newUser: User) => {
        localStorage.removeItem('logout_state');
        login(newToken, newUser);
      },
      logout,
      isAuthenticated: false,
    };
    
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  // Bypass apenas se não foi feito logout e não há token
  const value: AuthContextType = isInReplit && !token ? {
    user: { id: 999, username: 'magurk', email: 'admin@templodoabismo.com.br', isAdmin: true },
    token: 'replit-bypass-token',
    isLoading: false,
    login,
    logout,
    isAuthenticated: true,
  } : {
    user,
    token,
    isLoading: isLoading || false,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}