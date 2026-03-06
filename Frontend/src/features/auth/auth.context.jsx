import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  authenticate: false,
  setAuthenticate: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticate, setAuthenticate] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function initAuth() {
      setLoading(true);
      try {
        const data = await getMe();
        if (ignore) return;

        if (data?.authenticated) {
          setUser(data.user ?? null);
          setAuthenticate(true);
        } else {
          setUser(null);
          setAuthenticate(false);
        }
      } catch {
        if (ignore) return;
        setUser(null);
        setAuthenticate(false);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    initAuth();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        authenticate,
        setAuthenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
