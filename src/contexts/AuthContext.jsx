import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, usuariosService } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //decodificar token JWT (función simple sin verificación de firma)
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  //verificar si el token está expirado
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  };

  //cargar usuario desde token JWT al inicializar
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('vinylstore_token');
      const savedUser = localStorage.getItem('vinylstore_user');
      
      if (token && savedUser) {
        try {
          //verificar si el token no está expirado
          if (!isTokenExpired(token)) {
            //verificar token con el backend
            const verifiedUser = await authService.verifyToken();
            if (verifiedUser) {
              setUser(verifiedUser);
            } else {
              //si la verificación falla, limpiar datos
              localStorage.removeItem('vinylstore_token');
              localStorage.removeItem('vinylstore_user');
            }
          } else {
            //token expirado, limpiar datos
            localStorage.removeItem('vinylstore_token');
            localStorage.removeItem('vinylstore_user');
          }
        } catch (error) {
          console.error('Error al verificar token:', error);
          localStorage.removeItem('vinylstore_token');
          localStorage.removeItem('vinylstore_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  //función para hacer login con validación y obtener JWT
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      //el backend devuelve: { message: "Login exitoso", usuario: {...}, token: "..." }
      //el token puede venir en el header o en el body
      const token = response.token;
      const user = response.usuario || response.user;
      
      console.log('Login - Usuario recibido:', user);
      console.log('Login - Token recibido:', token ? 'Sí' : 'No');
      
      if (!user || !user.id) {
        console.error('Login - Usuario inválido en respuesta:', response);
        return { success: false, error: 'Respuesta inválida del servidor: usuario no encontrado' };
      }
      
      //guardar token y usuario
      if (token) {
        localStorage.setItem('vinylstore_token', token);
        console.log('Login - Token guardado en localStorage');
      } else {
        console.warn('⚠️ Login - No se recibió token JWT del backend');
        console.warn('⚠️ Esto puede causar problemas con las peticiones autenticadas');
        console.warn('⚠️ Verifica que el backend esté enviando el token en:');
        console.warn('   - Header: Authorization: Bearer <token>');
        console.warn('   - O en el body: { token: "..." }');
        
        //guardar un token temporal vacío para que el sistema no falle
        //esto es solo para desarrollo - en producción debe haber token
        localStorage.setItem('vinylstore_token', 'temp_no_token');
      }
      
      //remover password si existe y guardar usuario
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('vinylstore_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      console.log('Login - Usuario guardado:', userWithoutPassword);
      console.log('Login - Rol del usuario:', userWithoutPassword.rol);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message || 'Error al iniciar sesión' };
    }
  };

  //función para registrar nuevo usuario
  const register = async (userData) => {
    try {
      //el registro se hace a través del endpoint de usuarios
      const response = await usuariosService.create(userData);
      
      if (response && (response.id || response.email)) {
        //después del registro, intentar hacer login automático para obtener el token
        try {
          const loginResult = await login(userData.email, userData.password);
          if (loginResult.success) {
            return loginResult;
          }
        } catch (loginError) {
          console.error('Error en login automático después de registro:', loginError);
          //si el login automático falla, el usuario fue creado pero necesita hacer login manual
        }
        
        //si el login automático no funcionó, devolver el usuario creado
        const { password: _, ...userWithoutPassword } = response;
        return { 
          success: true, 
          user: userWithoutPassword, 
          requiresLogin: true,
          message: 'Usuario creado exitosamente. Por favor inicia sesión.'
        };
      }
      
      return { success: false, error: 'Error al registrar usuario: respuesta inválida del servidor' };
    } catch (error) {
      console.error('Error en registro:', error);
      //manejar errores específicos
      let errorMessage = error.message || 'Error al registrar usuario';
      if (errorMessage.includes('409') || errorMessage.includes('Conflict')) {
        errorMessage = 'El email ya está registrado';
      } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        errorMessage = 'Datos inválidos. Por favor verifica la información';
      }
      return { success: false, error: errorMessage };
    }
  };

  //función para hacer logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('vinylstore_token');
    localStorage.removeItem('vinylstore_user');
  };

  //función para verificar si el usuario es admin
  const isAdmin = () => {
    //la API usa 'Administrador' con mayúscula, pero también verificamos variantes
    return user?.rol === 'Administrador' || user?.rol === 'admin' || user?.role === 'admin' || user?.role === 'Administrador';
  };

  //función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem('vinylstore_token');
    return !!user && !!token && !isTokenExpired(token);
  };

  //función para actualizar perfil del usuario
  const updateProfile = async (userId, userData) => {
    try {
      const updatedUser = await usuariosService.update(userId, userData);
      if (updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser;
        setUser(userWithoutPassword);
        localStorage.setItem('vinylstore_user', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
      }
      return { success: false, error: 'Error al actualizar perfil' };
    } catch (error) {
      return { success: false, error: error.message || 'Error al actualizar perfil' };
    }
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
