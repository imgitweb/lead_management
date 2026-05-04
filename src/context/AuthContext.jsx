import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

/**
 * AuthProvider component that provides user state and auth actions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const DEMO_USER = {
    id: 'user-123',
    name: 'Ankit Jatav',
    email: 'ankit.jatav@cinfy.io',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ankit',
    role: 'Admin',
    company: 'Cinfy Dashboard Inc.'
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/admin/me');
      if (response.status === 200) {
        const userData = response.data.data;
        setUser({
          id: userData._id,
          name: userData.name,
          email: userData.email_id,
          role: userData.role,
          phone: userData.phone,
          location: userData.location,
          website: userData.website,
          company: userData.company,
          bio: userData.bio,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`,
          createdAt: userData.createdAt,
        });
        return true;
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      // If it's a 401, the token is invalid
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        setUser(null);
        return false;
      }
      // For other errors, clear user but don't redirect
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    // Restore session from localStorage on mount
    const restoreSession = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const success = await fetchUserProfile();
        if (!success) {
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };
    
    restoreSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/login', {
        email_id: email,
        password,
      });

      const data = response.data;

      if (response.status === 200 && data.token) {
        localStorage.setItem('auth_token', data.token);
        await fetchUserProfile(); // Fetch full user profile
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, message: data.message || 'Invalid email or password' };
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.';
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
