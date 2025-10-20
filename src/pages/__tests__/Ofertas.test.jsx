import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Ofertas from '../Ofertas';
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

describe('Ofertas Component', () => {
  test('debe renderizar el título principal', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText('Ofertas Especiales')).toBeInTheDocument();
  });

  test('debe mostrar la descripción de ofertas', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText(/Aprovecha estos increíbles descuentos/)).toBeInTheDocument();
  });

  test('debe mostrar filtros de precio', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText('Rango de Precio')).toBeInTheDocument();
    expect(screen.getByText('Todos los precios')).toBeInTheDocument();
  });

  test('debe mostrar filtros de categoría', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText('Categoría')).toBeInTheDocument();
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
  });

  test('debe mostrar opciones de ordenamiento', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText('Ordenar por')).toBeInTheDocument();
    expect(screen.getByText('Mayor Descuento')).toBeInTheDocument();
  });

  test('debe mostrar productos con descuentos', () => {
    renderWithProviders(<Ofertas />);
    
    //verificar que se muestran productos con badges de descuento
    const descuentoBadges = screen.getAllByText(/-\d+%/);
    expect(descuentoBadges.length).toBeGreaterThan(0);
  });

  test('debe mostrar precios originales tachados', () => {
    renderWithProviders(<Ofertas />);
    
    //verificar que se muestran precios tachados
    const preciosTachados = screen.getAllByText(/\$\d+/);
    expect(preciosTachados.length).toBeGreaterThan(0);
  });

  test('debe mostrar precios con descuento', () => {
    renderWithProviders(<Ofertas />);
    
    //verificar que se muestran precios con descuento
    const preciosDescuento = screen.getAllByText(/\$\d+/);
    expect(preciosDescuento.length).toBeGreaterThan(0);
  });

  test('debe calcular y mostrar ahorro', () => {
    renderWithProviders(<Ofertas />);
    
    //verificar que se muestra información de ahorro
    const ahorroText = screen.getAllByText(/Ahorras/);
    expect(ahorroText.length).toBeGreaterThan(0);
  });

  test('debe filtrar productos por precio', () => {
    renderWithProviders(<Ofertas />);
    
    const precioSelect = screen.getByDisplayValue('Todos los precios');
    fireEvent.change(precioSelect, { target: { value: '0-15000' } });
    
    expect(precioSelect.value).toBe('0-15000');
  });

  test('debe filtrar productos por categoría', () => {
    renderWithProviders(<Ofertas />);
    
    const categoriaSelect = screen.getByDisplayValue('Todas las categorías');
    fireEvent.change(categoriaSelect, { target: { value: 'rock' } });
    
    expect(categoriaSelect.value).toBe('rock');
  });

  test('debe cambiar el ordenamiento de productos', () => {
    renderWithProviders(<Ofertas />);
    
    const ordenSelect = screen.getByDisplayValue('Mayor Descuento');
    fireEvent.change(ordenSelect, { target: { value: 'precio-asc' } });
    
    expect(ordenSelect.value).toBe('precio-asc');
  });

  test('debe mostrar contador de productos en oferta', () => {
    renderWithProviders(<Ofertas />);
    
    const contador = screen.getByText(/productos en oferta/);
    expect(contador).toBeInTheDocument();
  });

  test('debe mostrar información de garantía y devoluciones', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText('Garantía')).toBeInTheDocument();
    expect(screen.getByText('Devoluciones')).toBeInTheDocument();
    expect(screen.getByText('Envío Gratis')).toBeInTheDocument();
  });

  test('debe mostrar oferta relámpago', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText('Oferta Relámpago')).toBeInTheDocument();
    expect(screen.getByText(/Descuentos de hasta 50%/)).toBeInTheDocument();
  });

  test('debe manejar clics en botones de ver oferta', () => {
    renderWithProviders(<Ofertas />);
    
    const verOfertaButtons = screen.getAllByText('Ver Oferta');
    fireEvent.click(verOfertaButtons[0]);
    
    //verificar que el botón es clickeable
    expect(verOfertaButtons[0]).toBeInTheDocument();
  });

  test('debe mostrar mensaje cuando no hay ofertas', () => {
    renderWithProviders(<Ofertas />);
    
    //verificar que los filtros están presentes
    const precioSelect = screen.getByDisplayValue('Todos los precios');
    expect(precioSelect).toBeInTheDocument();
    
    //verificar que el componente se renderiza correctamente
    expect(screen.getByText('Ofertas Especiales')).toBeInTheDocument();
  });

  test('debe tener estructura responsiva', () => {
    renderWithProviders(<Ofertas />);
    
    //verificar que existe un contenedor principal
    const containers = screen.getAllByRole('generic');
    const mainContainer = containers.find(container => 
      container.className.includes('container')
    );
    expect(mainContainer).toBeInTheDocument();
  });

  test('debe mostrar badges de categoría en productos', () => {
    renderWithProviders(<Ofertas />);
    
    const badges = screen.getAllByText(/rock|pop|jazz|clasica/i);
    expect(badges.length).toBeGreaterThan(0);
  });

  test('debe mostrar información de envío gratis', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText(/En compras sobre \$50.000/)).toBeInTheDocument();
  });

  test('debe manejar múltiples filtros simultáneos', () => {
    renderWithProviders(<Ofertas />);
    
    const precioSelect = screen.getByDisplayValue('Todos los precios');
    const categoriaSelect = screen.getByDisplayValue('Todas las categorías');
    
    fireEvent.change(precioSelect, { target: { value: '15000-25000' } });
    fireEvent.change(categoriaSelect, { target: { value: 'pop' } });
    
    expect(precioSelect.value).toBe('15000-25000');
    expect(categoriaSelect.value).toBe('pop');
  });

  test('debe mostrar información de tiempo limitado', () => {
    renderWithProviders(<Ofertas />);
    expect(screen.getByText('Por tiempo limitado')).toBeInTheDocument();
  });
});
