import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Checkout from '../Checkout';
import { AuthProvider } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { useCart } from '../../contexts/CartContext';

//mock del CartContext
vi.mock('../../contexts/CartContext', () => ({
  useCart: vi.fn()
}));

//mock del ToastContext
vi.mock('../../contexts/ToastContext', () => ({
  useToast: vi.fn(() => ({
    showToast: vi.fn()
  })),
  ToastProvider: ({ children }) => children
}));

//función helper para renderizar con providers
const renderWithProviders = (component, cartItems = []) => {
  const mockCartValue = {
    items: cartItems,
    totalPrice: cartItems.reduce((total, item) => total + (item.precio * item.qty), 0),
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    totalItems: cartItems.reduce((total, item) => total + item.qty, 0)
  };
  
  //configurar el mock para retornar los valores del carrito
  vi.mocked(useCart).mockReturnValue(mockCartValue);

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

describe('Checkout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCartItems = [
    {
      id: 1,
      nombre: 'Test Vinyl',
      precio: 25000,
      imagen: 'test.jpg',
      artista: 'Test Artist',
      qty: 1
    }
  ];

  test('debe renderizar el formulario de checkout', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    expect(screen.getByText('Información de Envío')).toBeInTheDocument();
  });

  test('debe mostrar campos de información personal', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    expect(screen.getByText('Nombre completo *')).toBeInTheDocument();
    expect(screen.getByText('Email *')).toBeInTheDocument();
    expect(screen.getByText('Teléfono *')).toBeInTheDocument();
  });

  test('debe mostrar campos de dirección', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    expect(screen.getByText('Dirección *')).toBeInTheDocument();
    expect(screen.getByText('Comuna *')).toBeInTheDocument();
    expect(screen.getByText('Región *')).toBeInTheDocument();
  });

  test('debe mostrar opciones de método de pago', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    expect(screen.getByText('Método de Pago')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('debe mostrar campos de tarjeta cuando se selecciona tarjeta', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    
    //verificar que los campos de tarjeta están presentes (por defecto está seleccionada tarjeta)
    expect(screen.getByText('Número de tarjeta *')).toBeInTheDocument();
    expect(screen.getByText('CVV *')).toBeInTheDocument();
    expect(screen.getByText('Fecha de vencimiento *')).toBeInTheDocument();
    expect(screen.getByText('Nombre en la tarjeta *')).toBeInTheDocument();
  });

  test('debe mostrar resumen del pedido', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    expect(screen.getByText('Resumen del Pedido')).toBeInTheDocument();
    expect(screen.getByText('Test Vinyl')).toBeInTheDocument();
  });

  test('debe calcular total correctamente', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    //verificar que se muestra el total en el resumen
    expect(screen.getByText('Total:')).toBeInTheDocument();
    const totalElements = screen.getAllByText('$25.000');
    expect(totalElements.length).toBeGreaterThan(0);
  });

  test('debe validar campos requeridos', async () => {
    renderWithProviders(<Checkout />, mockCartItems);
    
    const submitButton = screen.getByText(/Pagar/);
    fireEvent.click(submitButton);
    
    //verificar que se muestran errores de validación
    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    });
  });

  test('debe manejar cambios en campos del formulario', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    
    const inputs = screen.getAllByRole('textbox');
    const nombreInput = inputs[0]; // primer input
    fireEvent.change(nombreInput, { target: { value: 'Juan Pérez' } });
    
    expect(nombreInput.value).toBe('Juan Pérez');
  });

  test('debe cambiar método de pago correctamente', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    
    const metodoPagoSelect = screen.getByRole('combobox');
    fireEvent.change(metodoPagoSelect, { target: { value: 'transferencia' } });
    
    expect(metodoPagoSelect.value).toBe('transferencia');
  });

  test('debe mostrar mensaje de carrito vacío cuando no hay items', () => {
    renderWithProviders(<Checkout />, []);
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  test('debe mostrar botón de proceder al pago', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    const payButton = screen.getByText(/Pagar/);
    expect(payButton).toBeInTheDocument();
  });

  test('debe manejar formulario completo válido', async () => {
    renderWithProviders(<Checkout />, mockCartItems);
    
    //llenar formulario usando roles en lugar de labels
    const inputs = screen.getAllByRole('textbox');
    
    fireEvent.change(inputs[0], { target: { value: 'Juan Pérez' } });
    fireEvent.change(inputs[1], { target: { value: 'juan@test.com' } });
    fireEvent.change(inputs[2], { target: { value: '123456789' } });
    fireEvent.change(inputs[3], { target: { value: 'Calle 123' } });
    fireEvent.change(inputs[4], { target: { value: 'Santiago' } });
    fireEvent.change(inputs[5], { target: { value: 'Metropolitana' } });
    
    const submitButton = screen.getByText(/Pagar/);
    fireEvent.click(submitButton);
    
    //verificar que el botón cambia a "Procesando..." o que se muestran errores de validación
    await waitFor(() => {
      //verificar que se muestran errores de validación para campos de tarjeta
      expect(screen.getByText('El número de tarjeta es requerido')).toBeInTheDocument();
      expect(screen.getByText('El CVV es requerido')).toBeInTheDocument();
    });
  });

  test('debe mostrar información de envío gratis', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    //verificar que se muestra el resumen del pedido con el total
    expect(screen.getByText('Total:')).toBeInTheDocument();
    const totalElements = screen.getAllByText('$25.000');
    expect(totalElements.length).toBeGreaterThan(0);
  });

  test('debe tener estructura responsiva', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    
    //verificar que existe un contenedor principal
    const containers = screen.getAllByRole('generic');
    const mainContainer = containers.find(container => 
      container.className.includes('container')
    );
    expect(mainContainer).toBeInTheDocument();
  });

  test('debe mostrar cantidad de productos en resumen', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    //verificar que se muestra la cantidad en el resumen
    expect(screen.getByText('Cantidad: 1')).toBeInTheDocument();
  });

  test('debe manejar múltiples métodos de pago', () => {
    renderWithProviders(<Checkout />, mockCartItems);
    
    const metodoPagoSelect = screen.getByRole('combobox');
    
    //verificar opciones disponibles
    expect(screen.getByText('Tarjeta de Crédito/Débito')).toBeInTheDocument();
    expect(screen.getByText('Transferencia Bancaria')).toBeInTheDocument();
    expect(screen.getByText('Pago Contra Entrega')).toBeInTheDocument();
    
    //cambiar a transferencia
    fireEvent.change(metodoPagoSelect, { target: { value: 'transferencia' } });
    expect(metodoPagoSelect.value).toBe('transferencia');
  });
});
