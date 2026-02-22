import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('wisora_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wisora_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('wisora_user');
    }
  }, [currentUser]);

  // Sync with backend on startup
  useEffect(() => {
    const syncUser = async () => {
      const token = localStorage.getItem('token');
      if (token && currentUser) {
        try {
          const res = await getMe();
          if (res.data.user) {
            setCurrentUser(res.data.user);
          }
        } catch (err) {
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
    };
    syncUser();
  }, []); // Run once on mount

  const login = (data) => {
    // Expects { token, user } from backend
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wisora_user');
    localStorage.removeItem('token');
  };

  const updateUser = (data) =>
    setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));

  return (
    <UserContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

export default UserContext;
