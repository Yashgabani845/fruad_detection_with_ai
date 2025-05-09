import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {loginUser,registerUser } from '../services/Auth.service'
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();
  
  const login = async (username, mpin) => {
    try {
      const response = await loginUser(username, mpin);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  
  
  const signup = async (name, username, mpin, gender, pan_card) => {
    try {
      const response = await registerUser(name, username, mpin, gender, pan_card);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };
  

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    navigate('/');
  };


  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);