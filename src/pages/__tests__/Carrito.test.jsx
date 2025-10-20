import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Carrito from '../Carrito';
import { AuthProvider } from '../../contexts/AuthContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { useCart } from '../../contexts/CartContext'; // Import the actual hook to mock it

//mock del CartContext
vi.mock('../../contexts/CartContext', () => ({
  useCart: vi.fn()
}));

//mock del ToastContext
vi.mock('../../contexts/ToastContext', () => ({
  useToast: vi.fn(() => ({
    showToast: vi.fn()
  })),
  ToastProvider: ({ children }) => children // Export ToastProvider as a passthrough
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

describe('Carrito Component', () => {
  const mockCartItems = [
    {
      id: 1,
      nombre: 'Test Vinyl 1',
      precio: 25000,
      imagen: 'test1.jpg',
      artista: 'Test Artist 1',
      qty: 2
    },
    {
      id: 2,
      nombre: 'Test Vinyl 2',
      precio: 30000,
      imagen: 'test2.jpg',
      artista: 'Test Artist 2',
      qty: 1
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe renderizar el título del carrito', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('Mi Carrito')).toBeInTheDocument();
  });

  test('debe mostrar productos en el carrito', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('Test Vinyl 1')).toBeInTheDocument();
    expect(screen.getByText('Test Vinyl 2')).toBeInTheDocument();
  });

  test('debe mostrar información de productos correctamente', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Test Artist 2')).toBeInTheDocument();
  });

  test('debe mostrar precios formateados', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('$25.000')).toBeInTheDocument();
    //verificar que aparece $30.000 (hay múltiples elementos con este precio)
    const priceElements = screen.getAllByText('$30.000');
    expect(priceElements.length).toBeGreaterThan(0);
  });

  test('debe mostrar cantidades de productos', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('2')).toBeInTheDocument(); //cantidad del primer producto
    expect(screen.getByText('1')).toBeInTheDocument(); //cantidad del segundo producto
  });

  test('debe mostrar subtotales correctos', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('$50.000')).toBeInTheDocument(); //25.000 * 2
    //verificar que aparece $30.000 en subtotales (hay múltiples elementos con este precio)
    const subtotalElements = screen.getAllByText('$30.000');
    expect(subtotalElements.length).toBeGreaterThan(0);
  });

  test('debe mostrar total correcto', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    //verificar que aparece el total en el resumen (hay múltiples elementos con $80.000)
    const totalElements = screen.getAllByText('$80.000');
    expect(totalElements.length).toBeGreaterThan(0);
  });

  test('debe mostrar información de envío gratis', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('Gratis')).toBeInTheDocument();
  });

  test('debe mostrar contador de productos en resumen', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('Productos (2)')).toBeInTheDocument();
  });

  test('debe manejar clics en botones de incrementar cantidad', () => {
    const mockAdd = vi.fn();
    const mockCartValue = {
      items: mockCartItems,
      totalPrice: 80000,
      add: mockAdd,
      remove: vi.fn(),
      clear: vi.fn(),
      totalItems: 3
    };
    
    vi.mocked(useCart).mockReturnValue(mockCartValue);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Carrito />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const incrementButtons = screen.getAllByText('+');
    fireEvent.click(incrementButtons[0]);
    
    expect(mockAdd).toHaveBeenCalled();
  });

  test('debe manejar clics en botones de decrementar cantidad', () => {
    const mockRemove = vi.fn();
    const mockCartValue = {
      items: mockCartItems,
      totalPrice: 80000,
      add: vi.fn(),
      remove: mockRemove,
      clear: vi.fn(),
      totalItems: 3
    };
    
    vi.mocked(useCart).mockReturnValue(mockCartValue);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Carrito />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const decrementButtons = screen.getAllByText('-');
    fireEvent.click(decrementButtons[0]);
    
    expect(mockRemove).toHaveBeenCalled();
  });

  test('debe manejar clics en botones de eliminar producto', () => {
    const mockRemove = vi.fn();
    const mockCartValue = {
      items: mockCartItems,
      totalPrice: 80000,
      add: vi.fn(),
      remove: mockRemove,
      clear: vi.fn(),
      totalItems: 3
    };
    
    vi.mocked(useCart).mockReturnValue(mockCartValue);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Carrito />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    //buscar botones de eliminar por su clase CSS ya que no tienen texto accesible
    const deleteButtons = screen.getAllByRole('button').filter(button => 
      button.className.includes('btn-outline-danger')
    );
    fireEvent.click(deleteButtons[0]);
    
    expect(mockRemove).toHaveBeenCalled();
  });

  test('debe manejar clic en botón de proceder al pago', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    
    const payButton = screen.getByText('Proceder al Pago');
    fireEvent.click(payButton);
    
    //verificar que el botón existe y es clickeable
    expect(payButton).toBeInTheDocument();
  });

  test('debe manejar clic en botón de vaciar carrito', () => {
    const mockClear = vi.fn();
    const mockCartValue = {
      items: mockCartItems,
      totalPrice: 80000,
      add: vi.fn(),
      remove: vi.fn(),
      clear: mockClear,
      totalItems: 3
    };
    
    vi.mocked(useCart).mockReturnValue(mockCartValue);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Carrito />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const clearButton = screen.getByText('Vaciar Carrito');
    fireEvent.click(clearButton);
    
    expect(mockClear).toHaveBeenCalled();
  });

  test('debe manejar clic en botón de seguir comprando', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    
    const continueButton = screen.getByText('Seguir Comprando');
    fireEvent.click(continueButton);
    
    //verificar que el botón existe y es clickeable
    expect(continueButton).toBeInTheDocument();
  });

  test('debe mostrar mensaje de carrito vacío cuando no hay items', () => {
    renderWithProviders(<Carrito />, []);
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  test('debe mostrar botón de ver productos cuando el carrito está vacío', () => {
    renderWithProviders(<Carrito />, []);
    expect(screen.getByText('Ver Productos')).toBeInTheDocument();
  });

  test('debe mostrar información de compra segura', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    expect(screen.getByText('Compra Segura')).toBeInTheDocument();
    expect(screen.getByText(/Tus datos están protegidos/)).toBeInTheDocument();
  });

  test('debe tener estructura de tabla responsiva', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    
    //verificar que existe la tabla
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  test('debe mostrar imágenes de productos', () => {
    renderWithProviders(<Carrito />, mockCartItems);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('debe deshabilitar botón de decrementar cuando cantidad es 1', () => {
    const singleItemCart = [{
      id: 1,
      nombre: 'Test Vinyl',
      precio: 25000,
      imagen: 'test.jpg',
      artista: 'Test Artist',
      qty: 1
    }];

    renderWithProviders(<Carrito />, singleItemCart);
    
    const decrementButton = screen.getByText('-');
    expect(decrementButton).toBeDisabled();
  });

  test('debe manejar estado de carrito con múltiples items', () => {
    const multipleItemsCart = [
      { id: 1, nombre: 'Item 1', precio: 10000, imagen: '1.jpg', artista: 'Artist 1', qty: 3 },
      { id: 2, nombre: 'Item 2', precio: 20000, imagen: '2.jpg', artista: 'Artist 2', qty: 2 },
      { id: 3, nombre: 'Item 3', precio: 15000, imagen: '3.jpg', artista: 'Artist 3', qty: 1 }
    ];

    renderWithProviders(<Carrito />, multipleItemsCart);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('Productos (3)')).toBeInTheDocument();
  });
});