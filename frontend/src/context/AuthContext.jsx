import React, { createContext, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wraps the application and provides authentication state.
 * Real authentication logic will be implemented when backend is ready.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Placeholder: will call authService.login() when backend is ready
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  // Placeholder: will call authService.logout() when backend is ready
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
