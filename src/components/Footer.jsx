import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4 className="footer-title">Sobre VinylStore</h4>
          <ul className="footer-links">
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>
        <div className="footer-copy">
          <p>© 2024 VinylStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
