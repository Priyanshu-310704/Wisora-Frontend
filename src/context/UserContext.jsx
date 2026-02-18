import { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (user) => setCurrentUser(user);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wisora_user');
  };

  const updateUser = (data) =>
    setCurrentUser((prev) => ({ ...prev, ...data }));

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
