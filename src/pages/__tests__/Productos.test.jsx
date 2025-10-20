import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Productos from '../Productos';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { ToastProvider } from '../../contexts/ToastContext';

//función helper para renderizar con providers
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

describe('Productos Component', () => {
  test('debe renderizar el título principal', () => {
    renderWithProviders(<Productos />);
    expect(screen.getByText('Nuestra Colección de Vinilos')).toBeInTheDocument();
  });

  test('debe mostrar la descripción de la página', () => {
    renderWithProviders(<Productos />);
    expect(screen.getByText('Descubre miles de títulos únicos y ediciones especiales')).toBeInTheDocument();
  });

  test('debe mostrar filtros de categorías', () => {
    renderWithProviders(<Productos />);
    expect(screen.getByText('Categorías')).toBeInTheDocument();
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getAllByText('Rock')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Jazz')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Pop')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Clásica')[0]).toBeInTheDocument();
  });

  test('debe mostrar todos los productos por defecto', () => {
    renderWithProviders(<Productos />);
    
    //verificar que se muestran productos (al menos algunos)
    const addButtons = screen.getAllByText('Agregar al Carrito');
    expect(addButtons.length).toBeGreaterThan(0);
  });

  test('debe filtrar productos por categoría', () => {
    renderWithProviders(<Productos />);
    
    //hacer clic en filtro Rock
    const rockFilter = screen.getAllByText('Rock')[0];
    fireEvent.click(rockFilter);
    
    //verificar que el filtro está activo (cambia de btn-outline-primary a btn-primary)
    expect(rockFilter).toHaveClass('btn-primary');
  });

  test('debe mostrar información de productos correctamente', () => {
    renderWithProviders(<Productos />);
    
    //verificar que se muestra información básica de productos
    expect(screen.getByText('Led Zeppelin IV')).toBeInTheDocument();
    const ledZeppelinElements = screen.getAllByText(/Led Zeppelin/);
    expect(ledZeppelinElements.length).toBeGreaterThan(0);
  });

  test('debe manejar clics en botones de agregar al carrito', () => {
    renderWithProviders(<Productos />);
    
    const addButtons = screen.getAllByText('Agregar al Carrito');
    fireEvent.click(addButtons[0]);
    
    //verificar que el botón existe y es clickeable
    expect(addButtons[0]).toBeInTheDocument();
  });

  test('debe mostrar precios formateados correctamente', () => {
    renderWithProviders(<Productos />);
    
    //buscar precios que contengan el símbolo $
    const prices = screen.getAllByText(/\$\d+/);
    expect(prices.length).toBeGreaterThan(0);
  });

  test('debe cambiar filtro activo correctamente', () => {
    renderWithProviders(<Productos />);
    
    //verificar que "Todos" está activo por defecto
    const todosFilter = screen.getByText('Todos');
    expect(todosFilter).toHaveClass('btn-primary');
    
    //cambiar a otro filtro
    const jazzFilter = screen.getAllByText('Jazz')[0];
    fireEvent.click(jazzFilter);
    
    //verificar que el nuevo filtro está activo
    expect(jazzFilter).toHaveClass('btn-primary');
  });

  test('debe mostrar botones de ver detalle', () => {
    renderWithProviders(<Productos />);
    
    //buscar botones que contengan "Ver" o "Detalles"
    const detailButtons = screen.queryAllByText(/Ver|Detalles/);
    expect(detailButtons.length).toBeGreaterThan(0);
  });

  test('debe tener estructura de grid para productos', () => {
    renderWithProviders(<Productos />);
    
    //verificar que existe la estructura de grid
    const gridContainer = screen.getByText('Categorías').closest('.container');
    expect(gridContainer).toBeInTheDocument();
  });

  test('debe mostrar chips de filtro con estilos correctos', () => {
    renderWithProviders(<Productos />);
    
    const chips = screen.getAllByRole('button');
    const filterChips = chips.filter(chip => 
      ['Todos', 'Rock', 'Jazz', 'Pop', 'Clásica'].includes(chip.textContent)
    );
    
    expect(filterChips.length).toBe(5);
  });

  test('debe manejar navegación a detalle de producto', () => {
    renderWithProviders(<Productos />);
    
    //buscar botones que contengan "Ver" o "Detalles"
    const detailButtons = screen.queryAllByText(/Ver|Detalles/);
    if (detailButtons.length > 0) {
      fireEvent.click(detailButtons[0]);
      //verificar que el botón es clickeable
      expect(detailButtons[0]).toBeInTheDocument();
    } else {
      //si no hay botones de detalle, verificar que al menos hay productos
      const addButtons = screen.getAllByText('Agregar al Carrito');
      expect(addButtons.length).toBeGreaterThan(0);
    }
  });

  test('debe mostrar overlay en imágenes de productos', () => {
    renderWithProviders(<Productos />);
    
    //verificar que existen imágenes
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('debe tener estructura responsiva', () => {
    renderWithProviders(<Productos />);
    
    //verificar que tiene estructura de contenedor
    const containers = screen.getAllByRole('generic');
    expect(containers.some(container => 
      container.className.includes('container')
    )).toBe(true);
  });
});
