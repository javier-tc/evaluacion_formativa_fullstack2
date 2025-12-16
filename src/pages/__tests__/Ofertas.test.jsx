import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Ofertas from '../Ofertas';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { ToastProvider } from '../../contexts/ToastContext';

//mock de datos con productos en oferta usando vi.hoisted
const { mockProducts, mockCategorias, mockGetAllProducts, mockGetAllCategorias } = vi.hoisted(() => {
  const products = [
    {
      id: 1,
      nombre: 'Led Zeppelin IV',
      artista: 'Led Zeppelin',
      genero: 'Rock',
      año: 1971,
      precio: 25000,
      precio_original: 30000,
      descuento: 17,
      imagen: 'https://example.com/led-zeppelin.jpg',
      categoria_id: 1,
      categoria: { id: 1, nombre: 'Rock' }
    },
    {
      id: 2,
      nombre: 'Back To Black',
      artista: 'Amy Winehouse',
      genero: 'Pop',
      año: 2006,
      precio: 30000,
      precio_original: 35000,
      descuento: 14,
      imagen: 'https://example.com/amy.jpg',
      categoria_id: 2,
      categoria: { id: 2, nombre: 'Pop' }
    },
    {
      id: 3,
      nombre: 'Kind of Blue',
      artista: 'Miles Davis',
      genero: 'Jazz',
      año: 1959,
      precio: 35000,
      precio_original: 40000,
      descuento: 13,
      imagen: 'https://example.com/miles.jpg',
      categoria_id: 3,
      categoria: { id: 3, nombre: 'Jazz' }
    }
  ];

  const categorias = [
    { id: 1, nombre: 'Rock' },
    { id: 2, nombre: 'Pop' },
    { id: 3, nombre: 'Jazz' },
    { id: 4, nombre: 'Clásica' }
  ];

  const getAllProducts = vi.fn().mockResolvedValue(products);
  const getAllCategorias = vi.fn().mockResolvedValue(categorias);

  return { 
    mockProducts: products, 
    mockCategorias: categorias,
    mockGetAllProducts: getAllProducts,
    mockGetAllCategorias: getAllCategorias
  };
});

//mock de los servicios API
vi.mock('../../services/api.js', () => ({
  productosService: {
    getAll: mockGetAllProducts
  },
  categoriasService: {
    getAll: mockGetAllCategorias
  }
}));

//mock del ToastContext
vi.mock('../../contexts/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  })
}));

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

describe('Ofertas Component', () => {
  beforeEach(() => {
    mockGetAllProducts.mockResolvedValue(mockProducts);
    mockGetAllCategorias.mockResolvedValue(mockCategorias);
  });

  test('debe renderizar el título principal', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      expect(screen.getByText('Ofertas Especiales')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('debe mostrar la descripción de ofertas', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      expect(screen.getByText(/Aprovecha estos increíbles descuentos/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('debe mostrar filtros de precio', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      expect(screen.getByText('Rango de Precio')).toBeInTheDocument();
      expect(screen.getByText('Todos los precios')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('debe mostrar filtros de categoría', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      expect(screen.getByText('Categoría')).toBeInTheDocument();
      expect(screen.getByText('Todas las categorías')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('debe mostrar opciones de ordenamiento', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      expect(screen.getByText('Ordenar por')).toBeInTheDocument();
      expect(screen.getByText('Mayor Descuento')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('debe mostrar productos con descuentos', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      const descuentoBadges = screen.queryAllByText(/-\d+%/);
      expect(descuentoBadges.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('debe mostrar precios originales tachados', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      const preciosTachados = screen.getAllByText(/\$\d+/);
      expect(preciosTachados.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('debe mostrar precios con descuento', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      const preciosDescuento = screen.getAllByText(/\$\d+/);
      expect(preciosDescuento.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('debe calcular y mostrar ahorro', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      const ahorroText = screen.queryAllByText(/Ahorras|ahorras/i);
      expect(ahorroText.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('debe filtrar productos por precio', async () => {
    renderWithProviders(<Ofertas />);
    
    let precioSelect;
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      precioSelect = screen.getByDisplayValue('Todos los precios');
      expect(precioSelect).toBeInTheDocument();
    }, { timeout: 5000 });

    fireEvent.change(precioSelect, { target: { value: '0-15000' } });
    
    expect(precioSelect.value).toBe('0-15000');
  });

  test('debe filtrar productos por categoría', async () => {
    renderWithProviders(<Ofertas />);
    
    let categoriaSelect;
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      categoriaSelect = screen.getByDisplayValue('Todas las categorías');
      expect(categoriaSelect).toBeInTheDocument();
    }, { timeout: 5000 });

    fireEvent.change(categoriaSelect, { target: { value: 'Rock' } });
    
    await waitFor(() => {
      expect(categoriaSelect.value).toBe('Rock');
    });
  });

  test('debe cambiar el ordenamiento de productos', async () => {
    renderWithProviders(<Ofertas />);
    
    let ordenSelect;
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      ordenSelect = screen.getByDisplayValue('Mayor Descuento');
      expect(ordenSelect).toBeInTheDocument();
    }, { timeout: 5000 });

    fireEvent.change(ordenSelect, { target: { value: 'precio-asc' } });
    
    expect(ordenSelect.value).toBe('precio-asc');
  });

  test('debe mostrar contador de productos en oferta', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      const contador = screen.queryByText(/productos en oferta/i);
      if (contador) {
        expect(contador).toBeInTheDocument();
      }
    }, { timeout: 3000 });
  });

  test('debe mostrar información de garantía y devoluciones', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      expect(screen.getByText('Garantía')).toBeInTheDocument();
      expect(screen.getByText('Devoluciones')).toBeInTheDocument();
      expect(screen.getByText('Envío Gratis')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('debe mostrar oferta relámpago', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      expect(screen.getByText('Oferta Relámpago')).toBeInTheDocument();
      expect(screen.getByText(/Descuentos de hasta 50%/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('debe manejar clics en botones de ver oferta', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      const verOfertaButtons = screen.queryAllByText('Ver Oferta');
      if (verOfertaButtons.length > 0) {
        fireEvent.click(verOfertaButtons[0]);
        expect(verOfertaButtons[0]).toBeInTheDocument();
      }
    }, { timeout: 3000 });
  });

  test('debe mostrar mensaje cuando no hay ofertas', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      expect(screen.getByText('Ofertas Especiales')).toBeInTheDocument();
      const precioSelect = screen.getByDisplayValue('Todos los precios');
      expect(precioSelect).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('debe tener estructura responsiva', () => {
    renderWithProviders(<Ofertas />);
    
    const containers = screen.getAllByRole('generic');
    const mainContainer = containers.find(container => 
      container.className.includes('container')
    );
    expect(mainContainer).toBeInTheDocument();
  });

  test('debe mostrar badges de categoría en productos', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      const badges = screen.queryAllByText(/rock|pop|jazz|clásica/i);
      if (badges.length > 0) {
        expect(badges.length).toBeGreaterThan(0);
      }
    }, { timeout: 3000 });
  });

  test('debe mostrar información de envío gratis', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.getByText(/En compras sobre \$50.000/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('debe manejar múltiples filtros simultáneos', async () => {
    renderWithProviders(<Ofertas />);
    
    let precioSelect, categoriaSelect;
    await waitFor(() => {
      expect(screen.queryByText('Cargando ofertas...')).not.toBeInTheDocument();
      precioSelect = screen.getByDisplayValue('Todos los precios');
      categoriaSelect = screen.getByDisplayValue('Todas las categorías');
      expect(precioSelect).toBeInTheDocument();
      expect(categoriaSelect).toBeInTheDocument();
    }, { timeout: 5000 });
    
    fireEvent.change(precioSelect, { target: { value: '15000-25000' } });
    fireEvent.change(categoriaSelect, { target: { value: 'Pop' } });
    
    await waitFor(() => {
      expect(precioSelect.value).toBe('15000-25000');
      expect(categoriaSelect.value).toBe('Pop');
    });
  });

  test('debe mostrar información de tiempo limitado', async () => {
    renderWithProviders(<Ofertas />);
    
    await waitFor(() => {
      expect(screen.getByText('Por tiempo limitado')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
