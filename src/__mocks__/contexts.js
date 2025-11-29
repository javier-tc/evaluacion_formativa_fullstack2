//mocks para AuthContext
export const mockAuthContext = {
  user: null,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  isAdmin: jest.fn(() => false),
  isAuthenticated: jest.fn(() => false)
};

export const mockAuthContextAdmin = {
  user: { email: 'admin@test.com', role: 'admin', name: 'Admin' },
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  isAdmin: jest.fn(() => true),
  isAuthenticated: jest.fn(() => true)
};

export const mockAuthContextUser = {
  user: { email: 'user@test.com', role: 'user', name: 'Usuario' },
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  isAdmin: jest.fn(() => false),
  isAuthenticated: jest.fn(() => true)
};

//mocks para CartContext
export const mockCartContext = {
  items: [],
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  totalItems: 0,
  totalPrice: 0
};

export const mockCartContextWithItems = {
  items: [
    { id: 1, name: 'Test Product', price: 100, qty: 2 },
    { id: 2, name: 'Another Product', price: 50, qty: 1 }
  ],
  add: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn(),
  totalItems: 3,
  totalPrice: 250
};

//mocks para ToastContext
export const mockToastContext = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
};

//mocks para funciones de navegación
export const mockNavigate = jest.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null
};

//mocks para localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

//mocks para funciones de validación
export const mockValidationRules = {
  email: {
    required: 'El email es obligatorio',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: jest.fn()
  },
  password: {
    required: 'La contraseña es obligatoria',
    minLength: 'La contraseña debe tener al menos 6 caracteres'
  },
  nombre: {
    required: 'El nombre es obligatorio',
    minLength: 'El nombre debe tener al menos 2 caracteres'
  }
};

//mocks para funciones de API (simuladas)
export const mockApiFunctions = {
  login: jest.fn(),
  register: jest.fn(),
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn()
};

//mocks para eventos del DOM
export const mockEvents = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: {
    name: 'test',
    value: 'test value',
    type: 'text',
    checked: false
  }
};

//mocks para timers
export const mockTimers = {
  setTimeout: jest.fn(),
  clearTimeout: jest.fn(),
  setInterval: jest.fn(),
  clearInterval: jest.fn()
};


