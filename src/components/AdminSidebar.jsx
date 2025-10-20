import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    //limpiar datos de sesión
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    //redirigir a la página principal
    navigate('/');
  };

  //función para determinar si un item está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="admin-sidebar" style={{ backgroundColor: '#1a1a1a', width: '280px', height: '100vh', position: 'fixed', left: '0', top: '0', zIndex: '1000' }}>
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-circle-notch"></i>
          <span>VinylStore</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => navigate('/admin')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#bdc3c7', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <i className="fas fa-th-large"></i>
              <span>Dashboard</span>
            </button>
          </li>
          <li className={`nav-item ${isActive('/admin/inventory') ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => navigate('/admin/inventory')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#bdc3c7', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <i className="fas fa-warehouse"></i>
              <span>Inventario</span>
            </button>
          </li>
          <li className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => navigate('/admin/users')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#bdc3c7', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <i className="fas fa-users"></i>
              <span>Usuarios</span>
            </button>
          </li>
          <li className={`nav-item ${isActive('/boletas') ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => navigate('/boletas')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#bdc3c7', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <i className="fas fa-receipt"></i>
              <span>Boletas</span>
            </button>
          </li>
          <li className={`nav-item ${isActive('/admin/reportes') ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => navigate('/admin/reportes')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#bdc3c7', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <i className="fas fa-chart-bar"></i>
              <span>Reportes</span>
            </button>
          </li>
          <li className={`nav-item ${isActive('/admin/perfil') ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => navigate('/admin/perfil')}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: '#bdc3c7', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <i className="fas fa-user-circle"></i>
              <span>Mi Perfil</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-profile">
        <div className="profile-info">
          <i className="fas fa-user-circle"></i>
          <span>Administrador</span>
        </div>
        <button 
          className="logout-btn"
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: '#e74c3c', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', cursor: 'pointer' }}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
