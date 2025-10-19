import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';

import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Blogs from './pages/Blogs.jsx';
import DetalleBlog from './pages/DetalleBlog.jsx';
import Contacto from './pages/Contacto.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Carrito from './pages/Carrito.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Inventory from './pages/admin/Inventory.jsx';
import Users from './pages/admin/Users.jsx';

// --- 🔹 Scroll automático hacia arriba al cambiar de ruta ---
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-shell">
          <Navbar />
          
          {/* Componente que asegura volver al tope en cada cambio de ruta */}
          <ScrollToTop />

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/productos' element={<Productos />} />
            <Route path='/producto/:id' element={<DetalleProducto />} />
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/blog/:id' element={<DetalleBlog />} />
            <Route path='/contacto' element={<Contacto />} />
            <Route path='/nosotros' element={<Nosotros />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registro' element={<Registro />} />
            <Route path='/carrito' element={<Carrito />} />
            <Route path='/admin' element={<Dashboard />} />
            <Route path='/admin/inventory' element={<Inventory />} />
            <Route path='/admin/users' element={<Users />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
