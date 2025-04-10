"use client";
import type { Auth } from "@/interfaces/auth.interface";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import authService from "@/services/authService";
import { useRouter } from "@/lib/i18nNavigation";

type LoginFunction = {
  username: string;
  password: string;
  onSuccess?: (user: any) => void;
  onFailed?: (error: any) => void;
};

const AuthenticationContext = React.createContext<{
  auth: Auth | undefined;
  login: ({ password, username }: LoginFunction) => void;
  logout: () => void;
}>({
  auth: undefined,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => use(AuthenticationContext);

type AuthenticationProviderProps = {
  children: React.ReactNode;
};

function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  // ! State
  const [auth, setAuth] = useState<Auth | undefined>(authService.getAuthStorage());
  const route = useRouter();
  // ! Function
  const login = useCallback(async ({ password, username, onFailed, onSuccess }: LoginFunction) => {
    try {
      if (username === "donezombie" && password === "donezombie") {
        const user = {
          token:
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb25AdGV4dGJhY2suYWkiLCJpc3MiOiJ0ZXh0YmFjay5haSIsImlhdCI6MTY5Nzc3ODE5OSwiZXhwIjoxNjk3ODY0NTk5fQ.UDiQJ1X2O8kTbXo1dMoFlNDUhJVKFfdNoLy1sYRvQz4",
          name: "donezombie",
          role: "admin",
        };

        setAuth(user);
        authService.saveAuthToStorage(user);
        onSuccess && onSuccess(user);
      } else if (username === "user" && password === "user") {
        const user = {
          token:
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkb25AdGV4dGJhY2suYWkiLCJpc3MiOiJ0ZXh0YmFjay5haSIsImlhdCI6MTY5Nzc3ODE5OSwiZXhwIjoxNjk3ODY0NTk5fQ.UDiQJ1X2O8kTbXo1dMoFlNDUhJVKFfdNoLy1sYRvQz4",
          name: "user",
          role: "user",
        };

        setAuth(user);
        authService.saveAuthToStorage(user);
        onSuccess && onSuccess(user);
      } else {
        onFailed && onFailed("Incorrect username / password");
      }
    } catch (error) {
      onFailed && onFailed(error);
    }
  }, []);

  const logout = useCallback(() => {
    authService.clearAuthStorage();
    window.location.reload();
  }, []);

  const values = useMemo(
    () => ({
      auth,
      logout,
      login,
    }),
    [auth, login, logout]
  );

  useEffect(() => {
    if (!auth?.token) {
      route.replace("/sign-in");
    }
  }, [auth, route]);

  return <AuthenticationContext.Provider value={values}>{children}</AuthenticationContext.Provider>;
}

export default AuthenticationProvider;
