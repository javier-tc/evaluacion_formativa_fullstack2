import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

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
import Categorias from './pages/Categorias.jsx';
import Checkout from './pages/Checkout.jsx';
import CompraExitosa from './pages/CompraExitosa.jsx';
import CompraFallida from './pages/CompraFallida.jsx';
import Ofertas from './pages/Ofertas.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Inventory from './pages/admin/Inventory.jsx';
import Users from './pages/admin/Users.jsx';
import NewProduct from './pages/admin/NewProduct.jsx';
import EditProduct from './pages/admin/EditProduct.jsx';
import NewUser from './pages/admin/NewUser.jsx';
import EditUser from './pages/admin/EditUser.jsx';
import Boletas from './pages/Boletas.jsx';
import Reportes from './pages/admin/Reportes.jsx';
import Perfil from './pages/admin/Perfil.jsx';

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

// Layout para páginas públicas (con Navbar y Footer)
const PublicLayout = ({ children }) => (
  <div className="app-shell">
    <Navbar />
    <ScrollToTop />
    <main className="app-main">
      {children}
    </main>
    <Footer />
  </div>
);

// Layout para páginas de admin (sin Navbar y Footer)
const AdminShell = ({ children }) => (
  <div className="admin-shell">
    <ScrollToTop />
    {children}
  </div>
);

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Rutas públicas con Navbar y Footer */}
            <Route path='/' element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            } />
            <Route path='/productos' element={
              <PublicLayout>
                <Productos />
              </PublicLayout>
            } />
            <Route path='/producto/:id' element={
              <PublicLayout>
                <DetalleProducto />
              </PublicLayout>
            } />
            <Route path='/blogs' element={
              <PublicLayout>
                <Blogs />
              </PublicLayout>
            } />
            <Route path='/blog/:id' element={
              <PublicLayout>
                <DetalleBlog />
              </PublicLayout>
            } />
            <Route path='/contacto' element={
              <PublicLayout>
                <Contacto />
              </PublicLayout>
            } />
            <Route path='/nosotros' element={
              <PublicLayout>
                <Nosotros />
              </PublicLayout>
            } />
            <Route path='/login' element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            } />
            <Route path='/registro' element={
              <PublicLayout>
                <Registro />
              </PublicLayout>
            } />
            <Route path='/carrito' element={
              <PublicLayout>
                <Carrito />
              </PublicLayout>
            } />
            <Route path='/categorias' element={
              <PublicLayout>
                <Categorias />
              </PublicLayout>
            } />
            <Route path='/categorias/:categoria' element={
              <PublicLayout>
                <Categorias />
              </PublicLayout>
            } />
            <Route path='/checkout' element={
              <PublicLayout>
                <Checkout />
              </PublicLayout>
            } />
            <Route path='/compra-exitosa' element={
              <PublicLayout>
                <CompraExitosa />
              </PublicLayout>
            } />
            <Route path='/compra-fallida' element={
              <PublicLayout>
                <CompraFallida />
              </PublicLayout>
            } />
            <Route path='/ofertas' element={
              <PublicLayout>
                <Ofertas />
              </PublicLayout>
            } />
            <Route path='/boletas' element={
              <AdminShell>
                <ProtectedRoute>
                  <Boletas />
                </ProtectedRoute>
              </AdminShell>
            } />
            
            {/* Rutas de admin sin Navbar y Footer - protegidas con autenticación y rol admin */}
            <Route path='/admin' element={
              <AdminShell>
                <ProtectedRoute requireAdmin={true}>
                  <Dashboard />
                </ProtectedRoute>
              </AdminShell>
            } />
            <Route path='/admin/inventory' element={
              <AdminShell>
                <ProtectedRoute requireAdmin={true}>
                  <Inventory />
                </ProtectedRoute>
              </AdminShell>
            } />
            <Route path='/admin/users' element={
              <AdminShell>
                <ProtectedRoute requireAdmin={true}>
                  <Users />
                </ProtectedRoute>
              </AdminShell>
            } />
            <Route path='/admin/products/new' element={
              <AdminShell>
                <ProtectedRoute requireAdmin={true}>
                  <NewProduct />
                </ProtectedRoute>
              </AdminShell>
            } />
            <Route path='/admin/products/edit/:id' element={
              <AdminShell>
                <ProtectedRoute requireAdmin={true}>
                  <EditProduct />
                </ProtectedRoute>
              </AdminShell>
            } />
            <Route path='/admin/users/new' element={
              <AdminShell>
                <ProtectedRoute requireAdmin={true}>
                  <NewUser />
                </ProtectedRoute>
              </AdminShell>
            } />
            <Route path='/admin/users/edit/:id' element={
              <AdminShell>
                <ProtectedRoute requireAdmin={true}>
                  <EditUser />
                </ProtectedRoute>
              </AdminShell>
            } />
            <Route path='/admin/reportes' element={
              <AdminShell>
                <ProtectedRoute requireAdmin={true}>
                  <Reportes />
                </ProtectedRoute>
              </AdminShell>
            } />
            <Route path='/admin/perfil' element={
              <AdminShell>
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              </AdminShell>
            } />
            
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
