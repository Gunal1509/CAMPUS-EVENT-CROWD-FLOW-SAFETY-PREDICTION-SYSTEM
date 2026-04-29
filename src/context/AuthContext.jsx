import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const ROLE_META = {
  admin:     { label: 'Administrator',  initials: 'AD', email: 'admin@campus.edu' },
  organizer: { label: 'Event Organizer', initials: 'EO', email: 'organizer@campus.edu' },
  security:  { label: 'Security Team',  initials: 'ST', email: 'security@campus.edu' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cs_user');
    return stored ? JSON.parse(stored) : null;
  });

  function login(role) {
    const meta = ROLE_META[role];
    const userData = { role, ...meta, token: `mock-jwt-${role}-${Date.now()}` };
    setUser(userData);
    localStorage.setItem('cs_user', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('cs_user');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
