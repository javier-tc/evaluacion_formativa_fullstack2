import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { AuthProvider } from '../../contexts/AuthContext';

//función helper para renderizar con providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AdminLayout Component', () => {
  test('debe renderizar el layout básico', () => {
    renderWithProviders(
      <AdminLayout title="Test Page">
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('debe mostrar el título correctamente', () => {
    renderWithProviders(
      <AdminLayout title="Dashboard">
        <div>Content</div>
      </AdminLayout>
    );

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Dashboard');
  });

  test('debe renderizar children correctamente', () => {
    renderWithProviders(
      <AdminLayout title="Test">
        <div data-testid="test-content">Contenido de prueba</div>
      </AdminLayout>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });

  test('debe mostrar acciones de header cuando se proporcionan', () => {
    const headerActions = (
      <button data-testid="action-btn">Acción</button>
    );

    renderWithProviders(
      <AdminLayout title="Test" headerActions={headerActions}>
        <div>Content</div>
      </AdminLayout>
    );

    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
    expect(screen.getByText('Acción')).toBeInTheDocument();
  });

  test('debe tener estructura de layout correcta', () => {
    renderWithProviders(
      <AdminLayout title="Test">
        <div>Content</div>
      </AdminLayout>
    );

    //verificar estructura del layout
    const adminBody = document.querySelector('.admin-body');
    const adminContainer = document.querySelector('.admin-container');
    const adminMain = document.querySelector('.admin-main');
    const adminHeader = document.querySelector('.admin-header');
    const adminContent = document.querySelector('.admin-content');

    expect(adminBody).toBeInTheDocument();
    expect(adminContainer).toBeInTheDocument();
    expect(adminMain).toBeInTheDocument();
    expect(adminHeader).toBeInTheDocument();
    expect(adminContent).toBeInTheDocument();
  });

  test('debe tener clases CSS correctas', () => {
    renderWithProviders(
      <AdminLayout title="Test">
        <div>Content</div>
      </AdminLayout>
    );

    const adminBody = document.querySelector('.admin-body');
    const adminContainer = document.querySelector('.admin-container');
    const adminMain = document.querySelector('.admin-main');
    const adminHeader = document.querySelector('.admin-header');
    const adminContent = document.querySelector('.admin-content');

    expect(adminBody).toHaveClass('admin-body');
    expect(adminContainer).toHaveClass('admin-container');
    expect(adminMain).toHaveClass('admin-main');
    expect(adminHeader).toHaveClass('admin-header');
    expect(adminContent).toHaveClass('admin-content');
  });

  test('debe manejar título vacío', () => {
    renderWithProviders(
      <AdminLayout title="">
        <div>Content</div>
      </AdminLayout>
    );

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('');
  });

  test('debe manejar children complejos', () => {
    const complexChildren = (
      <div>
        <h2>Subtítulo</h2>
        <p>Párrafo de contenido</p>
        <button>Botón</button>
      </div>
    );

    renderWithProviders(
      <AdminLayout title="Test">
        {complexChildren}
      </AdminLayout>
    );

    expect(screen.getByText('Subtítulo')).toBeInTheDocument();
    expect(screen.getByText('Párrafo de contenido')).toBeInTheDocument();
    expect(screen.getByText('Botón')).toBeInTheDocument();
  });

  test('debe tener estructura semántica correcta', () => {
    renderWithProviders(
      <AdminLayout title="Test">
        <div>Content</div>
      </AdminLayout>
    );

    //verificar roles semánticos
    const main = screen.getByRole('main');
    const header = screen.getByRole('banner');
    const heading = screen.getByRole('heading', { level: 1 });

    expect(main).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
  });

  test('debe ser accesible', () => {
    renderWithProviders(
      <AdminLayout title="Test Page">
        <div>Content</div>
      </AdminLayout>
    );

    //verificar que tiene estructura accesible
    const main = screen.getByRole('main');
    const header = screen.getByRole('banner');
    
    expect(main).toBeInTheDocument();
    expect(header).toBeInTheDocument();
  });

  test('debe manejar múltiples acciones de header', () => {
    const multipleActions = (
      <div>
        <button data-testid="action-1">Acción 1</button>
        <button data-testid="action-2">Acción 2</button>
        <button data-testid="action-3">Acción 3</button>
      </div>
    );

    renderWithProviders(
      <AdminLayout title="Test" headerActions={multipleActions}>
        <div>Content</div>
      </AdminLayout>
    );

    expect(screen.getByTestId('action-1')).toBeInTheDocument();
    expect(screen.getByTestId('action-2')).toBeInTheDocument();
    expect(screen.getByTestId('action-3')).toBeInTheDocument();
  });
});