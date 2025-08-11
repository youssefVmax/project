export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'salesman';
  avatar?: string;
  department?: string;
  joinDate: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  switchToUser: (userId: string) => void;
  currentViewingUser: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}