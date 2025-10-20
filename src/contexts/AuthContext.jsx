import React, { createContext, useContext, useState, useEffect } from 'react';
import { userDB } from '../data/users.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('vinylstore_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        //verificar que el usuario aún existe en la base de datos
        const currentUser = userDB.findById(userData.id);
        if (currentUser && currentUser.activo) {
          setUser(currentUser);
        } else {
          localStorage.removeItem('vinylstore_user');
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('vinylstore_user');
      }
    }
    setLoading(false);
  }, []);

  //función para hacer login con validación
  const login = (email, password) => {
    const userData = userDB.validateCredentials(email, password);
    if (userData) {
      //remover password del objeto antes de guardarlo
      const { password: _, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
      localStorage.setItem('vinylstore_user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Credenciales inválidas' };
  };

  //función para registrar nuevo usuario
  const register = (userData) => {
    //verificar si el email ya existe
    const existingUser = userDB.findByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: 'El email ya está registrado' };
    }

    const newUser = userDB.create(userData);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('vinylstore_user', JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  };

  //función para hacer logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('vinylstore_user');
  };

  //función para verificar si el usuario es admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  //función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  //función para actualizar perfil del usuario
  const updateProfile = (userId, userData) => {
    const updatedUser = userDB.update(userId, userData);
    if (updatedUser) {
      const { password: _, ...userWithoutPassword } = updatedUser;
      setUser(userWithoutPassword);
      localStorage.setItem('vinylstore_user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Error al actualizar perfil' };
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
