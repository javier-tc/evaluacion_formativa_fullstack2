import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../../contexts/CartContext';

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

describe('CartContext', () => {
  test('debe inicializar con carrito vacío', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  test('debe agregar items al carrito correctamente', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('add-btn'));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('100');
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
  });

  test('debe incrementar cantidad cuando se agrega el mismo item', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    //agregar el mismo item dos veces
    act(() => {
      fireEvent.click(screen.getByTestId('add-btn'));
      fireEvent.click(screen.getByTestId('add-btn'));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('200');
    expect(screen.getByTestId('items-count')).toHaveTextContent('1'); //solo un item único
  });

  test('debe remover items del carrito correctamente', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    //agregar item primero
    act(() => {
      fireEvent.click(screen.getByTestId('add-btn'));
    });

    //luego removerlo
    act(() => {
      fireEvent.click(screen.getByTestId('remove-btn'));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  test('debe limpiar todo el carrito correctamente', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    //agregar varios items
    act(() => {
      fireEvent.click(screen.getByTestId('add-btn'));
      fireEvent.click(screen.getByTestId('add-btn'));
    });

    //limpiar carrito
    act(() => {
      fireEvent.click(screen.getByTestId('clear-btn'));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  test('debe calcular totales correctamente con múltiples items', () => {
    //componente de prueba con múltiples items
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

    render(
      <CartProvider>
        <MultiItemTestComponent />
      </CartProvider>
    );

    //agregar diferentes items
    act(() => {
      fireEvent.click(screen.getByTestId('add-item1'));
      fireEvent.click(screen.getByTestId('add-item2'));
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('125'); //50 + 75
  });

  test('debe manejar items con propiedades completas', () => {
    //componente de prueba con item completo
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

    render(
      <CartProvider>
        <CompleteItemTestComponent />
      </CartProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('add-complete-item'));
    });

    expect(screen.getByTestId('item-name')).toHaveTextContent('Test Vinyl');
    expect(screen.getByTestId('item-price')).toHaveTextContent('25000');
    expect(screen.getByTestId('item-qty')).toHaveTextContent('1');
  });
});
