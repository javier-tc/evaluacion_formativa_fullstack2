import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from '../../pages/Home';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { ToastProvider } from '../../contexts/ToastContext';

//mock de datos usando vi.hoisted
const { mockProducts, mockCategorias, mockGetAllProducts, mockGetAllCategorias } = vi.hoisted(() => {
  const products = [
    {
      id: 1,
      nombre: 'Led Zeppelin IV',
      artista: 'Led Zeppelin',
      genero: 'Rock',
      año: 1971,
      precio: 25000,
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
      imagen: 'https://example.com/miles.jpg',
      categoria_id: 3,
      categoria: { id: 3, nombre: 'Jazz' }
    }
  ];

  const categorias = [
    { id: 1, nombre: 'Rock' },
    { id: 2, nombre: 'Pop' },
    { id: 3, nombre: 'Jazz' }
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
  beforeEach(() => {
    mockGetAllProducts.mockResolvedValue(mockProducts);
    mockGetAllCategorias.mockResolvedValue(mockCategorias);
  });

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

  test('debe renderizar productos destacados correctamente', async () => {
    renderWithProviders(<Home />);
    
    await waitFor(() => {
      const productCards = screen.getAllByText(/Agregar al Carrito/);
      expect(productCards).toHaveLength(3);
    }, { timeout: 3000 });
  });

  test('debe mostrar información de cada producto', async () => {
    renderWithProviders(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Led Zeppelin IV')).toBeInTheDocument();
    }, { timeout: 3000 });

    const ledZeppelinElements = screen.getAllByText(/Led Zeppelin/);
    expect(ledZeppelinElements.length).toBeGreaterThan(0);
  });

  test('debe tener estructura responsiva con Bootstrap', () => {
    renderWithProviders(<Home />);
    
    const sections = screen.getAllByRole('generic');
    const heroSection = sections.find(section => 
      section.className.includes('section-hero')
    );
    expect(heroSection).toBeInTheDocument();
  });

  test('debe manejar clics en botones de productos', async () => {
    renderWithProviders(<Home />);
    
    await waitFor(() => {
      const addButtons = screen.getAllByText('Agregar al Carrito');
      expect(addButtons.length).toBeGreaterThan(0);
    }, { timeout: 3000 });

    const addButtons = screen.getAllByText('Agregar al Carrito');
    fireEvent.click(addButtons[0]);
    
    expect(addButtons[0]).toBeInTheDocument();
  });
});
