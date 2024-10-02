// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

const useAuth = (): string | null => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const { role } = JSON.parse(user);
      setUserRole(role);
    } else {
      setUserRole(null);
    }
  }, []);

  return userRole;
};

export default useAuth;
