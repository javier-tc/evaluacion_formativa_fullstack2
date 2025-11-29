//servicio de API para comunicación con el backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

//función auxiliar para obtener el token JWT
const getToken = () => {
  return localStorage.getItem('vinylstore_token');
};

//función auxiliar para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

//función auxiliar para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } catch (e) {
      //si no se puede parsear el error, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  
  //manejar respuestas vacías (como DELETE 204)
  if (response.status === 204 || response.status === 201) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (e) {
        return {};
      }
    }
    return {};
  }
  
  return response.json();
};

//servicio de autenticación
export const authService = {
  //login y obtener token JWT
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      //log para debugging
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.error('Login error:', errorData);
        throw new Error(errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      //verificar todos los headers disponibles
      console.log('Headers disponibles:');
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
      
      //el token JWT puede venir en el header Authorization o en el body
      const authHeader = response.headers.get('Authorization');
      const authHeaderLower = response.headers.get('authorization'); //algunos servidores usan minúsculas
      let token = null;
      
      if (authHeader) {
        //el token viene en el header Authorization: Bearer <token>
        token = authHeader.replace('Bearer ', '').trim();
        console.log('Token encontrado en header Authorization');
      } else if (authHeaderLower) {
        token = authHeaderLower.replace('Bearer ', '').trim();
        console.log('Token encontrado en header authorization (minúscula)');
      } else {
        //intentar obtener el token del body con diferentes nombres posibles
        token = data.token || data.accessToken || data.access_token || data.jwt || data.jwtToken;
        if (token) {
          console.log('Token encontrado en el body de la respuesta');
        } else {
          console.log('Token no encontrado ni en headers ni en body');
          console.log('Claves disponibles en data:', Object.keys(data));
        }
      }
      
      console.log('Token obtenido:', token ? 'Sí' : 'No');
      if (token) {
        console.log('Token (primeros 20 caracteres):', token.substring(0, 20) + '...');
      }
      
      //retornar datos con el token incluido
      return {
        ...data,
        token: token
      };
    } catch (error) {
      console.error('Error en login service:', error);
      throw error;
    }
  },

  //verificar token (usando el endpoint de obtener usuario actual)
  verifyToken: async () => {
    const token = getToken();
    if (!token) return null;
    
    try {
      //intentar obtener el usuario actual usando el token
      //esto valida implícitamente el token
      const userData = localStorage.getItem('vinylstore_user');
      if (userData) {
        const user = JSON.parse(userData);
        //verificar que el usuario existe en el backend
        const response = await fetch(`${API_BASE_URL}/usuarios/${user.id}`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          return await response.json();
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
};

//servicio de usuarios
export const usuariosService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (userData) => {
    //el registro no requiere autenticación
    try {
      console.log('Registrando usuario:', { ...userData, password: '***' });
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      console.log('Registro response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        console.error('Registro error:', errorData);
        throw new Error(errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json().catch(() => ({}));
      console.log('Registro response data:', data);
      return data;
    } catch (error) {
      console.error('Error en registro service:', error);
      throw error;
    }
  },

  update: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

//servicio de categorías
export const categoriasService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (categoriaData) => {
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoriaData)
    });
    return handleResponse(response);
  },

  update: async (id, categoriaData) => {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoriaData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

//servicio de productos
export const productosService = {
  getAll: async (activo = null) => {
    const url = activo !== null 
      ? `${API_BASE_URL}/productos?activo=${activo}` 
      : `${API_BASE_URL}/productos`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getByCategoria: async (categoriaId) => {
    const response = await fetch(`${API_BASE_URL}/productos/categoria/${categoriaId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  buscar: async (artista) => {
    const response = await fetch(`${API_BASE_URL}/productos/buscar?artista=${encodeURIComponent(artista)}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productoData)
    });
    return handleResponse(response);
  },

  update: async (id, productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productoData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

//servicio de blogs
export const blogsService = {
  getAll: async (publicado = null) => {
    const url = publicado !== null 
      ? `${API_BASE_URL}/blogs?publicado=${publicado}` 
      : `${API_BASE_URL}/blogs`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(blogData)
    });
    return handleResponse(response);
  },

  update: async (id, blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(blogData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

//servicio de carrito
export const carritoService = {
  getCarrito: async (usuarioId) => {
    const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  addItem: async (usuarioId, productoId, cantidad = 1) => {
    const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}/${productoId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cantidad })
    });
    return handleResponse(response);
  },

  updateItem: async (usuarioId, productoId, cantidad) => {
    const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}/${productoId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cantidad })
    });
    return handleResponse(response);
  },

  removeItem: async (usuarioId, productoId) => {
    const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}/${productoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  clearCarrito: async (usuarioId) => {
    const response = await fetch(`${API_BASE_URL}/carrito/${usuarioId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

//servicio de órdenes
export const ordenesService = {
  getAll: async (usuarioId = null) => {
    const url = usuarioId 
      ? `${API_BASE_URL}/ordenes?usuarioId=${usuarioId}` 
      : `${API_BASE_URL}/ordenes`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/ordenes/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (ordenData) => {
    const response = await fetch(`${API_BASE_URL}/ordenes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ordenData)
    });
    return handleResponse(response);
  },

  createFromCarrito: async (usuarioId, ordenData) => {
    const response = await fetch(`${API_BASE_URL}/ordenes/carrito/${usuarioId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ordenData)
    });
    return handleResponse(response);
  },

  update: async (id, ordenData) => {
    const response = await fetch(`${API_BASE_URL}/ordenes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(ordenData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/ordenes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

