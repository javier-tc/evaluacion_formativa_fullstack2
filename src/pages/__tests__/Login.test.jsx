import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';

//función helper para renderizar con providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  test('debe renderizar el formulario de login', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Accede a tu cuenta de VinylStore')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico *')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña *')).toBeInTheDocument();
  });

  test('debe mostrar checkbox de recordar sesión', () => {
    renderWithProviders(<Login />);
    
    const checkbox = screen.getByLabelText('Recordar mi sesión');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.type).toBe('checkbox');
  });

  test('debe mostrar enlace de registro', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Regístrate aquí' })).toBeInTheDocument();
  });

  test('debe validar email requerido', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Correo Electrónico *');
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();
    });
  });

  test('debe validar formato de email', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Correo Electrónico *');
    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText('Ingresa un email válido')).toBeInTheDocument();
    });
  });

  test('debe validar dominios permitidos', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Correo Electrónico *');
    fireEvent.change(emailInput, { target: { value: 'test@yahoo.com' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText('Solo se permiten correos de @duoc.cl, @profesor.duoc.cl y @gmail.com')).toBeInTheDocument();
    });
  });

  test('debe aceptar dominios válidos', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Correo Electrónico *');
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.queryByText('Solo se permiten correos de @duoc.cl, @profesor.duoc.cl y @gmail.com')).not.toBeInTheDocument();
    });
  });

  test('debe validar contraseña requerida', async () => {
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByLabelText('Contraseña *');
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
    });
  });

  test('debe validar longitud mínima de contraseña', async () => {
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByLabelText('Contraseña *');
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 4 caracteres')).toBeInTheDocument();
    });
  });

  test('debe validar longitud máxima de contraseña', async () => {
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByLabelText('Contraseña *');
    fireEvent.change(passwordInput, { target: { value: '12345678901' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText('La contraseña no puede exceder 10 caracteres')).toBeInTheDocument();
    });
  });

  test('debe manejar checkbox de recordar sesión', () => {
    renderWithProviders(<Login />);
    
    const checkbox = screen.getByLabelText('Recordar mi sesión');
    expect(checkbox.checked).toBe(false);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('debe mostrar estado de carga al enviar formulario', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Correo Electrónico *');
    const passwordInput = screen.getByLabelText('Contraseña *');
    const submitButton = screen.getByRole('button', { name: 'Ingresar' });
    
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Ingresando...')).toBeInTheDocument();
    });
  });

  test('debe manejar login de admin correctamente', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByLabelText('Correo Electrónico *');
    const passwordInput = screen.getByLabelText('Contraseña *');
    const submitButton = screen.getByRole('button', { name: 'Ingresar' });
    
    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    
    fireEvent.click(submitButton);
    
    //esperar a que termine la simulación de login
    await waitFor(() => {
      expect(screen.queryByText('Ingresando...')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('debe prevenir envío con formulario inválido', async () => {
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: 'Ingresar' });
    fireEvent.click(submitButton);
    
    //no debe mostrar estado de carga si hay errores
    expect(screen.queryByText('Ingresando...')).not.toBeInTheDocument();
  });

  test('debe tener estructura de formulario correcta', () => {
    renderWithProviders(<Login />);
    
    const form = document.querySelector('form.auth-card');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('novalidate');
  });

  test('debe tener placeholders correctos', () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByPlaceholderText('tu@correo.cl');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
});
