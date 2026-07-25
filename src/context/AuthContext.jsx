import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://leaddesk-h4p6.onrender.com/";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setAdmin(res.data.admin);
        }
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(
      `${API_BASE}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    if (res.data.success) {
      setAdmin(res.data.admin);
    }
    return res.data;
  };

  const logout = async () => {
    await axios.post(
      `${API_BASE}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
