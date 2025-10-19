import React from 'react';
import { Link } from 'react-router-dom';
export default function Footer(){
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <h4>Sobre VynilStore</h4>
          <ul>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>
        <div className="footer-right">
          <p>© VinylStore</p>
        </div>
      </div>
    </footer>
  );
}
