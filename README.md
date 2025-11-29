# VinylStore - Sistema de Tienda de Vinilos Full Stack

## Descripción General

VinylStore es una aplicación web full stack para la venta de vinilos, desarrollada con React en el frontend y una API REST en el backend. El sistema implementa autenticación basada en tokens JWT, gestión de sesiones persistentes y restricciones de acceso basadas en roles.

## Integración Backend-Frontend mediante API REST

### Comunicación entre Servicios

El sistema implementa una integración completa entre el backend y frontend mediante una API REST. La comunicación se realiza a través de un servicio centralizado (`src/services/api.js`) que gestiona todas las peticiones HTTP.

#### Flujo de Datos

1. **Servicio de API Centralizado**: 
   - Ubicado en `src/services/api.js`
   - Gestiona todas las peticiones HTTP al backend
   - Incluye manejo automático de tokens JWT en los headers
   - Base URL configurable mediante variable de entorno `VITE_API_BASE_URL`

2. **Contextos React**:
   - `AuthContext`: Gestiona autenticación y estado del usuario
   - `CartContext`: Gestiona el carrito de compras sincronizado con el backend
   - Ambos contextos utilizan el servicio de API para todas las operaciones

3. **Páginas y Componentes**:
   - Todas las páginas consumen datos del backend a través de los servicios
   - Los componentes se actualizan automáticamente cuando cambian los datos
   - Manejo de estados de carga y errores en todas las operaciones

#### Ejemplo de Flujo de Datos

```
Usuario → Componente React → Context (AuthContext/CartContext) 
→ Servicio API → Backend REST → Base de Datos
→ Respuesta JSON → Servicio API → Context → Componente → UI Actualizada
```

#### Endpoints Implementados

- **Autenticación**: `/api/usuarios/login` (POST) - Login y obtención de token JWT
- **Usuarios**: `/api/usuarios/` (GET, POST), `/api/usuarios/{id}` (GET, PUT, DELETE)
- **Productos**: `/api/productos/` (GET, POST), `/api/productos/{id}` (GET, PUT, DELETE)
- **Productos por categoría**: `/api/productos/categoria/{categoriaId}` (GET)
- **Búsqueda de productos**: `/api/productos/buscar?artista=nombre` (GET)
- **Categorías**: `/api/categorias/` (GET, POST), `/api/categorias/{id}` (GET, PUT, DELETE)
- **Blogs**: `/api/blogs/` (GET, POST), `/api/blogs/{id}` (GET, PUT, DELETE)
- **Carrito**: `/api/carrito/{usuarioId}` (GET, DELETE), `/api/carrito/{usuarioId}/{productoId}` (POST, PUT, DELETE)
- **Órdenes**: `/api/ordenes/` (GET, POST), `/api/ordenes/{id}` (GET, PUT, DELETE)
- **Órdenes desde carrito**: `/api/ordenes/carrito/{usuarioId}` (POST)

#### Eficiencia de la Comunicación

- **Headers de Autenticación**: Se incluyen automáticamente en todas las peticiones autenticadas
- **Manejo de Errores**: Sistema centralizado de manejo de errores HTTP
- **Caché Local**: Los datos se almacenan en el estado de React para evitar peticiones innecesarias
- **Actualización Optimista**: El UI se actualiza inmediatamente mientras se procesa la petición

## Autenticación con JWT y Roles

### Implementación de Autenticación

El sistema implementa autenticación basada en tokens JWT (JSON Web Tokens) para asegurar que solo usuarios autorizados puedan acceder a ciertos recursos.

#### Proceso de Autenticación

1. **Login**:
   - El usuario envía credenciales (email y password) al endpoint `/api/usuarios/login`
   - El backend valida las credenciales y genera un token JWT
   - El token se almacena en `localStorage` con la clave `vinylstore_token`
   - El usuario se almacena en `localStorage` con la clave `vinylstore_user`

2. **Registro**:
   - El usuario se registra a través del endpoint `/api/usuarios/` (POST)
   - Los campos requeridos son: `nombre`, `apellido`, `email`, `password`
   - Campos opcionales: `telefono`, `direccion`, `region`, `comuna`, `rol`
   - El rol por defecto es "Usuario" (la API acepta "Usuario" o "Administrador")

2. **Verificación de Token**:
   - En cada carga de la aplicación, se verifica si existe un token válido
   - Se valida la expiración del token antes de usarlo
   - Si el token es válido, se restaura la sesión del usuario
   - Si el token está expirado, se limpia el almacenamiento local

3. **Renovación de Token**:
   - El token se verifica en cada petición al backend
   - Si el backend responde con un error 401, se considera el token inválido
   - El usuario es redirigido automáticamente al login

#### Gestión de Roles y Permisos

El sistema implementa roles de usuario para controlar el acceso a funcionalidades:

- **Usuario (`Usuario`)**: Acceso a funcionalidades básicas (ver productos, carrito, compras)
- **Administrador (`Administrador`)**: Acceso completo al panel administrativo y gestión de recursos

**Nota**: La API utiliza roles con mayúscula inicial ("Usuario" y "Administrador"). El código maneja ambas variantes para compatibilidad.

#### Seguridad del Token

- **Almacenamiento**: El token se almacena en `localStorage` (considerar migrar a `httpOnly` cookies en producción)
- **Expiración**: El token incluye información de expiración que se verifica antes de cada uso
- **Headers**: El token se envía automáticamente en el header `Authorization: Bearer <token>` en todas las peticiones autenticadas
- **Validación**: El backend valida la firma y expiración del token en cada petición

#### Código de Implementación

```javascript
// Decodificación y verificación de token
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

const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};
```

## Gestión de Sesiones en el Frontend

### Persistencia de Sesión

El sistema implementa un sistema robusto de gestión de sesiones que mantiene el estado de autenticación del usuario incluso después de recargas de página.

#### Características de la Sesión

1. **Persistencia en localStorage**:
   - Token JWT: `localStorage.getItem('vinylstore_token')`
   - Datos del usuario: `localStorage.getItem('vinylstore_user')`
   - Los datos persisten entre recargas de página y cierres del navegador

2. **Inicialización de Sesión**:
   - Al cargar la aplicación, el `AuthContext` verifica si existe un token válido
   - Si el token existe y no está expirado, se restaura la sesión del usuario
   - Si el token está expirado, se limpia el almacenamiento y se requiere nuevo login

3. **Sincronización con Backend**:
   - Al inicializar, se verifica el token con el backend mediante `/api/auth/verify`
   - Si el backend confirma que el token es válido, se mantiene la sesión
   - Si el backend rechaza el token, se limpia la sesión local

#### Seguridad de la Sesión

- **Verificación de Expiración**: Se verifica la expiración del token antes de cada uso
- **Limpieza Automática**: Si el token está expirado, se limpia automáticamente el almacenamiento
- **Validación con Backend**: Se valida periódicamente con el backend para asegurar que la sesión sigue siendo válida

#### Código de Implementación

```javascript
// Carga de usuario desde token JWT al inicializar
useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem('vinylstore_token');
    const savedUser = localStorage.getItem('vinylstore_user');
    
    if (token && savedUser) {
      try {
        // Verificar si el token no está expirado
        if (!isTokenExpired(token)) {
          // Verificar token con el backend
          const verifiedUser = await authService.verifyToken();
          if (verifiedUser) {
            setUser(verifiedUser);
          } else {
            // Si la verificación falla, limpiar datos
            localStorage.removeItem('vinylstore_token');
            localStorage.removeItem('vinylstore_user');
          }
        } else {
          // Token expirado, limpiar datos
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
```

## Restricciones de Acceso en el Frontend

### Implementación de Protección de Rutas

El sistema implementa restricciones de acceso a funcionalidades asegurando que las interfaces y acciones sean accesibles únicamente por usuarios con los permisos adecuados.

#### Componente ProtectedRoute

Se creó un componente `ProtectedRoute` (`src/components/ProtectedRoute.jsx`) que:

- Verifica si el usuario está autenticado
- Verifica si el usuario tiene el rol requerido (para rutas de admin)
- Redirige automáticamente si no cumple los requisitos
- Muestra un indicador de carga mientras verifica la autenticación

#### Rutas Protegidas

1. **Rutas que Requieren Autenticación**:
   - `/admin/perfil`: Perfil del usuario
   - `/boletas`: Historial de compras
   - `/checkout`: Proceso de pago

2. **Rutas que Requieren Rol Admin**:
   - `/admin`: Dashboard administrativo
   - `/admin/inventory`: Gestión de inventario
   - `/admin/users`: Gestión de usuarios
   - `/admin/products/new`: Crear producto
   - `/admin/products/edit/:id`: Editar producto
   - `/admin/users/new`: Crear usuario
   - `/admin/users/edit/:id`: Editar usuario
   - `/admin/reportes`: Reportes y estadísticas

#### Verificación de Roles

El sistema verifica roles de dos formas:

1. **En el Navbar**: Solo muestra el enlace "Admin" si el usuario tiene rol `admin`
2. **En las Rutas**: El componente `ProtectedRoute` verifica el rol antes de renderizar

#### Código de Implementación

```javascript
// Componente ProtectedRoute
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Uso en App.jsx
<Route path='/admin' element={
  <AdminShell>
    <ProtectedRoute requireAdmin={true}>
      <Dashboard />
    </ProtectedRoute>
  </AdminShell>
} />
```

#### Ejemplos de Interfaces Restringidas

1. **Panel Administrativo**:
   - Solo accesible para usuarios con rol `admin`
   - Incluye: Dashboard, Inventario, Usuarios, Reportes
   - Si un usuario sin permisos intenta acceder, es redirigido a la página principal

2. **Gestión de Productos**:
   - Crear, editar y eliminar productos solo para administradores
   - Los usuarios regulares solo pueden ver y comprar productos

3. **Gestión de Usuarios**:
   - Solo administradores pueden ver, crear, editar y eliminar usuarios
   - Los usuarios regulares solo pueden ver y editar su propio perfil

4. **Checkout y Compras**:
   - Requiere autenticación (cualquier usuario autenticado)
   - Los usuarios no autenticados son redirigidos al login

## Configuración del Proyecto

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Construcción

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── ProtectedRoute.jsx    # Componente para proteger rutas
│   └── ...
├── contexts/
│   ├── AuthContext.jsx       # Contexto de autenticación con JWT
│   ├── CartContext.jsx       # Contexto de carrito sincronizado con backend
│   └── ...
├── services/
│   └── api.js                # Servicio centralizado de API REST
├── pages/
│   ├── admin/               # Páginas administrativas (requieren rol admin)
│   └── ...
└── ...
```

## Conclusión

El sistema VinylStore implementa una arquitectura completa de integración backend-frontend mediante API REST, con autenticación segura basada en tokens JWT, gestión de sesiones persistentes y restricciones de acceso basadas en roles. Esto asegura que solo usuarios autorizados puedan acceder a las funcionalidades correspondientes, mejorando tanto la seguridad como la experiencia de usuario.

