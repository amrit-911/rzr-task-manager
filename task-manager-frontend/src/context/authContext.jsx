import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser } from "../api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("token", data.token);
    setUser({ token: data.token });
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem("token", data.token);
    setUser({ token: data.token });
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
