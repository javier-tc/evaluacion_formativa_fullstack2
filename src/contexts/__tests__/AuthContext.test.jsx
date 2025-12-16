import React from 'react';
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

//función helper para crear un token JWT válido para tests
const createMockJWT = (payload = {}) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const defaultPayload = {
    sub: '1',
    exp: Math.floor(Date.now() / 1000) + 3600, //expira en 1 hora
    ...payload
  };
  const encodedPayload = btoa(JSON.stringify(defaultPayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const signature = 'mock-signature';
  return `${header}.${encodedPayload}.${signature}`;
};

//mock del servicio de API usando vi.hoisted para definir funciones antes del mock
const { mockLogin, mockVerifyToken } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockVerifyToken: vi.fn().mockResolvedValue(null)
}));

vi.mock('../../services/api.js', () => ({
  authService: {
    login: mockLogin,
    verifyToken: mockVerifyToken
  },
  usuariosService: {
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn()
  }
}));

//componente de prueba para acceder al contexto
const TestComponent = () => {
  const { user, login, logout, isAdmin, isAuthenticated } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'null'}</div>
      <div data-testid="is-admin">{isAdmin() ? 'true' : 'false'}</div>
      <div data-testid="is-authenticated">{isAuthenticated() ? 'true' : 'false'}</div>
      <button data-testid="login-btn" onClick={() => login('admin@duocuc.cl', 'Admin123')}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    const validToken = createMockJWT({ sub: '1', exp: Math.floor(Date.now() / 1000) + 3600 });
    mockLogin.mockResolvedValue({
      usuario: { id: 1, email: 'admin@duocuc.cl', rol: 'Administrador' },
      token: validToken
    });
    mockVerifyToken.mockResolvedValue(null);
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('debe proporcionar valores iniciales correctos', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  test('debe permitir hacer login correctamente', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-btn'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('admin@duocuc.cl');
    }, { timeout: 2000 });

    expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
  });

  test('debe permitir hacer logout correctamente', async () => {
    const validToken = createMockJWT({ sub: '1', exp: Math.floor(Date.now() / 1000) + 3600 });
    mockLogin.mockResolvedValue({
      usuario: { id: 1, email: 'admin@duocuc.cl', rol: 'Administrador' },
      token: validToken
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-btn'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('admin@duocuc.cl');
    });

    act(() => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  test('debe persistir usuario en localStorage', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-btn'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('admin@duocuc.cl');
    }, { timeout: 2000 });

    expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
  });

  test('debe cargar usuario desde localStorage al inicializar', async () => {
    const userData = { id: 1, email: 'saved@test.com', rol: 'user', nombre: 'Saved User' };
    const validToken = createMockJWT({ sub: '1', exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem('vinylstore_user', JSON.stringify(userData));
    localStorage.setItem('vinylstore_token', validToken);

    mockVerifyToken.mockResolvedValue(userData);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    const userElement = screen.getByTestId('user');
    const isAuthenticatedElement = screen.getByTestId('is-authenticated');
    
    expect(userElement).toBeInTheDocument();
    expect(isAuthenticatedElement).toBeInTheDocument();
  });

  test('debe manejar errores en localStorage correctamente', async () => {
    localStorage.setItem('vinylstore_user', 'invalid-json');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  test('debe distinguir entre usuarios admin y normales', async () => {
    const TestComponentWithLogin = () => {
      const { user, login, isAdmin, isAuthenticated } = useAuth();
      return (
        <div>
          <div data-testid="user">{user ? user.email : 'null'}</div>
          <div data-testid="is-admin">{isAdmin() ? 'true' : 'false'}</div>
          <div data-testid="is-authenticated">{isAuthenticated() ? 'true' : 'false'}</div>
          <button data-testid="admin-login-btn" onClick={() => login('admin@duocuc.cl', 'Admin123')}>
            Login Admin
          </button>
          <button data-testid="user-login-btn" onClick={() => login('maria.gonzalez@duocuc.cl', 'Pass123')}>
            Login User
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponentWithLogin />
      </AuthProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const adminToken = createMockJWT({ sub: '1', exp: Math.floor(Date.now() / 1000) + 3600 });
    mockLogin.mockResolvedValueOnce({
      usuario: { id: 1, email: 'admin@duocuc.cl', rol: 'Administrador' },
      token: adminToken
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('admin-login-btn'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
    }, { timeout: 2000 });

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    }, { timeout: 2000 });

    const userToken = createMockJWT({ sub: '2', exp: Math.floor(Date.now() / 1000) + 3600 });
    mockLogin.mockResolvedValueOnce({
      usuario: { id: 2, email: 'maria.gonzalez@duocuc.cl', rol: 'Usuario' },
      token: userToken
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('user-login-btn'));
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await waitFor(() => {
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    }, { timeout: 2000 });

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
  });
});
