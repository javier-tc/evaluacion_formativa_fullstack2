import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
export default function Navbar(){
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const active = ({ isActive }) => (isActive ? "nav-link nav-active" : "nav-link");
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand"><h1><Link to="/" className="nav-brand-link">VinylStore</Link></h1></div>
        <div className="nav-right">
          <ul className="nav-menu">
            <li><NavLink to="/" className={active}>Inicio</NavLink></li>
            <li><NavLink to="/productos" className={active}>Productos</NavLink></li>
            <li><NavLink to="/blogs" className={active}>Blogs</NavLink></li>
            {!user && <li><NavLink to="/login" className={active}>Ingresar</NavLink></li>}
            {!user && <li><NavLink to="/registro" className={active}>Registrarse</NavLink></li>}
            <li><NavLink to="/carrito" className={active}><span className="cart-icon">🛒</span> Carrito ({totalItems})</NavLink></li>
            {user?.role==='admin' && <li><NavLink to="/admin" className={active}>Admin</NavLink></li>}
            {user && <li><button className="nav-link" onClick={()=>{logout(); navigate('/')}}>Salir</button></li>}
          </ul>
        </div>
      </nav>
    </header>
  );
}
