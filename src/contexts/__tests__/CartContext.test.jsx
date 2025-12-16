import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { vi } from 'vitest';

//mock del servicio de API
vi.mock('../../services/api.js', () => ({
  carritoService: {
    getCarrito: vi.fn().mockResolvedValue({ items: [] }),
    addItem: vi.fn().mockResolvedValue({}),
    removeItem: vi.fn().mockResolvedValue({}),
    clearCarrito: vi.fn().mockResolvedValue({}),
    updateItem: vi.fn().mockResolvedValue({})
  }
}));

//componente de prueba para acceder al contexto
const TestComponent = () => {
  const { items, add, remove, clear, totalItems, totalPrice } = useCart();
  
  return (
    <div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <div data-testid="items-count">{items.length}</div>
      <button 
        data-testid="add-btn" 
        onClick={() => add({ id: 1, name: 'Test Product', price: 100 })}
      >
        Add Item
      </button>
      <button 
        data-testid="remove-btn" 
        onClick={() => remove(1)}
      >
        Remove Item
      </button>
      <button 
        data-testid="clear-btn" 
        onClick={clear}
      >
        Clear Cart
      </button>
    </div>
  );
};

//wrapper con providers necesarios
const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <CartProvider>
        {component}
      </CartProvider>
    </AuthProvider>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('debe inicializar con carrito vacío', async () => {
    renderWithProviders(<TestComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  test('debe agregar items al carrito correctamente', async () => {
    renderWithProviders(<TestComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-btn'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('100');
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
  });

  test('debe incrementar cantidad cuando se agrega el mismo item', async () => {
    renderWithProviders(<TestComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-btn'));
      await new Promise(resolve => setTimeout(resolve, 50));
      fireEvent.click(screen.getByTestId('add-btn'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('200');
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
  });

  test('debe remover items del carrito correctamente', async () => {
    renderWithProviders(<TestComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-btn'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('remove-btn'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  test('debe limpiar todo el carrito correctamente', async () => {
    renderWithProviders(<TestComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-btn'));
      await new Promise(resolve => setTimeout(resolve, 50));
      fireEvent.click(screen.getByTestId('add-btn'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('clear-btn'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  test('debe calcular totales correctamente con múltiples items', async () => {
    const MultiItemTestComponent = () => {
      const { totalItems, totalPrice, add } = useCart();
      
      return (
        <div>
          <div data-testid="total-items">{totalItems}</div>
          <div data-testid="total-price">{totalPrice}</div>
          <button 
            data-testid="add-item1" 
            onClick={() => add({ id: 1, name: 'Item 1', price: 50 })}
          >
            Add Item 1
          </button>
          <button 
            data-testid="add-item2" 
            onClick={() => add({ id: 2, name: 'Item 2', price: 75 })}
          >
            Add Item 2
          </button>
        </div>
      );
    };

    renderWithProviders(<MultiItemTestComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-item1'));
      await new Promise(resolve => setTimeout(resolve, 50));
      fireEvent.click(screen.getByTestId('add-item2'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('125');
  });

  test('debe manejar items con propiedades completas', async () => {
    const CompleteItemTestComponent = () => {
      const { items, add } = useCart();
      
      return (
        <div>
          <div data-testid="item-name">{items[0]?.name || 'none'}</div>
          <div data-testid="item-price">{items[0]?.price || '0'}</div>
          <div data-testid="item-qty">{items[0]?.qty || '0'}</div>
          <button 
            data-testid="add-complete-item" 
            onClick={() => add({ 
              id: 1, 
              name: 'Test Vinyl', 
              price: 25000, 
              image: 'test.jpg',
              artist: 'Test Artist'
            })}
          >
            Add Complete Item
          </button>
        </div>
      );
    };

    renderWithProviders(<CompleteItemTestComponent />);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-complete-item'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(screen.getByTestId('item-name')).toHaveTextContent('Test Vinyl');
    expect(screen.getByTestId('item-price')).toHaveTextContent('25000');
    expect(screen.getByTestId('item-qty')).toHaveTextContent('1');
  });
});
