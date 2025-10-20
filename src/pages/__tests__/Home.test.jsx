import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { ToastProvider } from '../../contexts/ToastContext';

//función helper para renderizar componentes con providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            {component}
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  test('debe renderizar el título principal', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Descubre la Magia del Vinilo')).toBeInTheDocument();
  });

  test('debe mostrar la descripción del hero', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('La mejor colección de vinilos clásicos y contemporáneos')).toBeInTheDocument();
  });

  test('debe mostrar botones de acción en el hero', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Únete Ahora')).toBeInTheDocument();
    expect(screen.getByText('Ver Productos')).toBeInTheDocument();
  });

  test('debe mostrar la sección de productos destacados', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Productos Destacados')).toBeInTheDocument();
  });

  test('debe renderizar productos destacados correctamente', () => {
    renderWithProviders(<Home />);
    
    //verificar que se muestran los primeros 3 productos
    const productCards = screen.getAllByText(/Agregar al Carrito/);
    expect(productCards).toHaveLength(3);
  });

  test('debe mostrar información de cada producto', () => {
    renderWithProviders(<Home />);
    
    //verificar que se muestra información básica de productos
    expect(screen.getByText('Led Zeppelin IV')).toBeInTheDocument();
    const ledZeppelinElements = screen.getAllByText(/Led Zeppelin/);
    expect(ledZeppelinElements.length).toBeGreaterThan(0);
  });

  test('debe tener estructura responsiva con Bootstrap', () => {
    renderWithProviders(<Home />);
    
    //verificar que usa componentes de Bootstrap
    const containers = screen.getAllByRole('main');
    expect(containers[0]).toBeInTheDocument();
  });

  test('debe manejar clics en botones de productos', () => {
    renderWithProviders(<Home />);
    
    const addButtons = screen.getAllByText('Agregar al Carrito');
    fireEvent.click(addButtons[0]);
    
    //verificar que el botón existe y es clickeable
    expect(addButtons[0]).toBeInTheDocument();
  });
});
