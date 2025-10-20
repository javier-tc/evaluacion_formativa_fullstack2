import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  //función para manejar el logout y cerrar el menú móvil
  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  //función para cerrar el menú móvil al hacer clic en un enlace
  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <BootstrapNavbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      fixed="top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" onClick={handleNavClick}>
          <h1 className="mb-0">VinylStore</h1>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" onClick={handleNavClick}>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/productos" onClick={handleNavClick}>
              Productos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/categorias" onClick={handleNavClick}>
              Categorías
            </Nav.Link>
            <Nav.Link as={NavLink} to="/ofertas" onClick={handleNavClick}>
              Ofertas
            </Nav.Link>
            <Nav.Link as={NavLink} to="/blogs" onClick={handleNavClick}>
              Blogs
            </Nav.Link>
          </Nav>
          
          <Nav>
            {!user && (
              <>
                <Nav.Link as={NavLink} to="/login" onClick={handleNavClick}>
                  Ingresar
                </Nav.Link>
                <Nav.Link as={NavLink} to="/registro" onClick={handleNavClick}>
                  Registrarse
                </Nav.Link>
              </>
            )}
            
            <Nav.Link as={NavLink} to="/carrito" onClick={handleNavClick}>
              <span className="cart-icon">🛒</span> Carrito ({totalItems})
            </Nav.Link>
            
            {user?.role === 'admin' && (
              <Nav.Link as={NavLink} to="/admin" onClick={handleNavClick}>
                Admin
              </Nav.Link>
            )}
            
            {user && (
              <Button 
                variant="outline-light" 
                className="ms-2"
                onClick={handleLogout}
              >
                Salir
              </Button>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
