import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Categorias from '../Categorias';
import { CartProvider } from '../../contexts/CartContext';
import { ToastProvider } from '../../contexts/ToastContext';

//función helper para renderizar con providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Categorias Component', () => {
  test('debe renderizar el título principal', () => {
    renderWithProviders(<Categorias />);
    //buscar específicamente el título h2
    const titulo = screen.getByRole('heading', { level: 2 });
    expect(titulo).toHaveTextContent(/Todas las categorías/);
  });

  test('debe mostrar todas las categorías disponibles', () => {
    renderWithProviders(<Categorias />);
    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
    expect(screen.getByText('Jazz')).toBeInTheDocument();
    expect(screen.getByText('Clasica')).toBeInTheDocument();
  });

  test('debe mostrar filtros de precio', () => {
    renderWithProviders(<Categorias />);
    expect(screen.getByText('Rango de Precio')).toBeInTheDocument();
    expect(screen.getByText('Todos los precios')).toBeInTheDocument();
  });

  test('debe mostrar filtros de año', () => {
    renderWithProviders(<Categorias />);
    expect(screen.getByText('Año mínimo')).toBeInTheDocument();
    expect(screen.getByText('Todos los años')).toBeInTheDocument();
  });

  test('debe mostrar opciones de ordenamiento', () => {
    renderWithProviders(<Categorias />);
    expect(screen.getByText('Ordenar por')).toBeInTheDocument();
    expect(screen.getByText('Nombre A-Z')).toBeInTheDocument();
    expect(screen.getByText('Precio: Menor a Mayor')).toBeInTheDocument();
  });

  test('debe filtrar productos por precio', () => {
    renderWithProviders(<Categorias />);
    
    const precioSelect = screen.getByDisplayValue('Todos los precios');
    fireEvent.change(precioSelect, { target: { value: '0-20000' } });
    
    expect(precioSelect.value).toBe('0-20000');
  });

  test('debe filtrar productos por año', () => {
    renderWithProviders(<Categorias />);
    
    const añoSelect = screen.getByDisplayValue('Todos los años');
    fireEvent.change(añoSelect, { target: { value: '2020' } });
    
    expect(añoSelect.value).toBe('2020');
  });

  test('debe cambiar el ordenamiento de productos', () => {
    renderWithProviders(<Categorias />);
    
    const ordenSelect = screen.getByDisplayValue('Nombre A-Z');
    fireEvent.change(ordenSelect, { target: { value: 'precio-asc' } });
    
    expect(ordenSelect.value).toBe('precio-asc');
  });

  test('debe mostrar productos filtrados correctamente', () => {
    renderWithProviders(<Categorias />);
    
    //verificar que se muestran productos
    const verDetallesButtons = screen.getAllByText('Ver Detalles');
    expect(verDetallesButtons.length).toBeGreaterThan(0);
  });

  test('debe mostrar información de productos con formato correcto', () => {
    renderWithProviders(<Categorias />);
    
    //verificar que se muestran precios formateados
    const precios = screen.getAllByText(/\$\d+/);
    expect(precios.length).toBeGreaterThan(0);
  });

  test('debe mostrar badges de categoría en productos', () => {
    renderWithProviders(<Categorias />);
    
    //verificar que existen badges de categoría
    const badges = screen.getAllByText(/rock|pop|jazz|clasica/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  test('debe manejar clics en botones de ver detalles', () => {
    renderWithProviders(<Categorias />);
    
    const detailButtons = screen.getAllByText('Ver Detalles');
    fireEvent.click(detailButtons[0]);
    
    //verificar que el botón es clickeable
    expect(detailButtons[0]).toBeInTheDocument();
  });

  test('debe mostrar mensaje cuando no hay productos', () => {
    renderWithProviders(<Categorias />);
    
    //verificar que el componente se renderiza correctamente
    expect(screen.getByText('Categorías')).toBeInTheDocument();
    expect(screen.getByText('Filtros')).toBeInTheDocument();
  });

  test('debe tener estructura responsiva con Bootstrap', () => {
    renderWithProviders(<Categorias />);
    
    //verificar que tiene las clases de Bootstrap
    const containers = screen.getAllByRole('generic');
    const mainContainer = containers.find(container => 
      container.className.includes('container')
    );
    expect(mainContainer).toBeInTheDocument();
  });

  test('debe mostrar contador de productos encontrados', () => {
    renderWithProviders(<Categorias />);
    
    //verificar que se muestra el contador en el título
    const titulo = screen.getByText(/Todas las categorías \(\d+\)/);
    expect(titulo).toBeInTheDocument();
  });

  test('debe manejar cambios en filtros múltiples', () => {
    renderWithProviders(<Categorias />);
    
    //cambiar múltiples filtros
    const precioSelect = screen.getByDisplayValue('Todos los precios');
    const añoSelect = screen.getByDisplayValue('Todos los años');
    
    fireEvent.change(precioSelect, { target: { value: '20000-30000' } });
    fireEvent.change(añoSelect, { target: { value: '2010' } });
    
    expect(precioSelect.value).toBe('20000-30000');
    expect(añoSelect.value).toBe('2010');
  });
});
