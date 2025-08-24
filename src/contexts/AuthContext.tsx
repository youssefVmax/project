import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Demo users with different roles
const demoUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@vmax.com',
    name: 'Admin',
    role: 'admin',
    avatar: 'AD',
    department: 'Management',
    joinDate: '2024-01-15',
    isActive: true
  },
  {
    id: 'sales-1',
    email: 'john@flashx.com',
    name: 'John Smith',
    role: 'salesman',
    avatar: 'JS',
    department: 'Sales',
    joinDate: '2024-03-10',
    isActive: true
  },
  {
    id: 'sales-2',
    email: 'sarah@flashx.com',
    name: 'Sarah Johnson',
    role: 'salesman',
    avatar: 'SJ',
    department: 'Sales',
    joinDate: '2024-02-20',
    isActive: true
  },
  {
    id: 'sales-3',
    email: 'mike@flashx.com',
    name: 'Mike Wilson',
    role: 'salesman',
    avatar: 'MW',
    department: 'Sales',
    joinDate: '2024-04-05',
    isActive: true
  }
];

// Demo credentials
const demoCredentials = [
  { email: 'admin@vmax.com', password: 'admin@VSF' }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentViewingUser, setCurrentViewingUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const authData = localStorage.getItem('authData');
    const viewingUserData = localStorage.getItem('currentViewingUser');
    
    if (authData) {
      try {
        const { user: storedUser } = JSON.parse(authData);
        setUser(storedUser);
        setIsAuthenticated(true);
        
        if (viewingUserData) {
          const viewingUser = JSON.parse(viewingUserData);
          setCurrentViewingUser(viewingUser);
        } else {
          setCurrentViewingUser(storedUser);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials
    const credentials = demoCredentials.find(
      cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );

    if (credentials) {
      const foundUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        setCurrentViewingUser(foundUser);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('authData', JSON.stringify({ user: foundUser }));
        localStorage.setItem('currentViewingUser', JSON.stringify(foundUser));
        
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentViewingUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authData');
    localStorage.removeItem('currentViewingUser');
  };

  const switchToUser = (userId: string) => {
    const targetUser = demoUsers.find(u => u.id === userId);
    if (targetUser && user?.role === 'admin') {
      setCurrentViewingUser(targetUser);
      localStorage.setItem('currentViewingUser', JSON.stringify(targetUser));
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    users: demoUsers,
    switchToUser,
    currentViewingUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};