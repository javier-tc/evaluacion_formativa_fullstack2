import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

//función helper para renderizar con router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Footer Component', () => {
  test('debe renderizar el título de la empresa', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Sobre VinylStore')).toBeInTheDocument();
  });

  test('debe mostrar enlaces de navegación', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  test('debe mostrar copyright correcto', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('© 2025 VinylStore. Todos los derechos reservados.')).toBeInTheDocument();
  });

  test('debe tener estructura responsiva con Bootstrap', () => {
    renderWithRouter(<Footer />);
    
    //verificar que usa clases CSS personalizadas
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('footer');
  });

  test('debe tener enlaces funcionales', () => {
    renderWithRouter(<Footer />);
    
    const nosotrosLink = screen.getByRole('link', { name: 'Nosotros' });
    const contactoLink = screen.getByRole('link', { name: 'Contacto' });
    
    expect(nosotrosLink).toHaveAttribute('href', '/nosotros');
    expect(contactoLink).toHaveAttribute('href', '/contacto');
  });

  test('debe tener estructura de enlaces correcta', () => {
    renderWithRouter(<Footer />);
    
    const nosotrosLink = screen.getByRole('link', { name: 'Nosotros' });
    const contactoLink = screen.getByRole('link', { name: 'Contacto' });
    
    //verificar que los enlaces están presentes y son elementos <a>
    expect(nosotrosLink).toBeInTheDocument();
    expect(contactoLink).toBeInTheDocument();
    expect(nosotrosLink.tagName).toBe('A');
    expect(contactoLink.tagName).toBe('A');
  });

  test('debe tener estructura de contenedor personalizado', () => {
    renderWithRouter(<Footer />);
    
    //verificar que tiene estructura de contenedor personalizado
    const footerInner = document.querySelector('.footer-inner');
    const footerCol = document.querySelector('.footer-col');
    const footerCopy = document.querySelector('.footer-copy');
    
    expect(footerInner).toBeInTheDocument();
    expect(footerCol).toBeInTheDocument();
    expect(footerCopy).toBeInTheDocument();
  });

  test('debe ser accesible', () => {
    renderWithRouter(<Footer />);
    
    //verificar que tiene rol de contentinfo
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});
