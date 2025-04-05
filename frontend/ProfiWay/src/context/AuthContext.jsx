import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"], // Kullanıcı ID
          email: decoded.Email,
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
          token: token,
        });
      } catch (err) {
        console.error("Token decode error:", err);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://localhost:7198/api/Auth/login",
        { email, password }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser({
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"], // Kullanıcı ID
        email: decoded.Email,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        token: token,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token'); 
    sessionStorage.removeItem('token'); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
