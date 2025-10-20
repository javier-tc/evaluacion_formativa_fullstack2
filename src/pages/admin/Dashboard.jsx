import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';

const Dashboard = () => {
  const navigate = useNavigate();

  const headerActions = (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <button 
        className="btn-base btn-primary"
        onClick={() => navigate('/admin/products/new')}
      >
        <i className="fas fa-plus"></i>
        Nuevo Producto
      </button>
      <button 
        className="btn-base btn-primary"
        onClick={() => navigate('/admin/users/new')}
      >
        <i className="fas fa-user-plus"></i>
        Nuevo Usuario
      </button>
    </div>
  );

  return (
    <AdminPageLayout title="¡HOLA Administrador!" headerActions={headerActions}>
      <div className="content-section">
        <h2>Actividad Reciente</h2>
        <div className="activity-grid">
          <div className="activity-card">
            <h3>Últimos Usuarios Registrados</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="activity-details">
                  <p className="activity-text">Nuevo usuario: <strong>María González</strong></p>
                  <span className="activity-time">Hace 2 horas</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="activity-details">
                  <p className="activity-text">Nuevo usuario: <strong>Carlos Ruiz</strong></p>
                  <span className="activity-time">Hace 4 horas</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="activity-details">
                  <p className="activity-text">Nuevo usuario: <strong>Ana Silva</strong></p>
                  <span className="activity-time">Hace 6 horas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="activity-card">
            <h3>Últimos Productos Agregados</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-avatar">
                  <i className="fas fa-music"></i>
                </div>
                <div className="activity-details">
                  <p className="activity-text">Nuevo producto: <strong>Pink Floyd - Dark Side</strong></p>
                  <span className="activity-time">Hace 1 día</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">
                  <i className="fas fa-music"></i>
                </div>
                <div className="activity-details">
                  <p className="activity-text">Nuevo producto: <strong>The Beatles - Abbey Road</strong></p>
                  <span className="activity-time">Hace 2 días</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">
                  <i className="fas fa-music"></i>
                </div>
                <div className="activity-details">
                  <p className="activity-text">Nuevo producto: <strong>Queen - Bohemian Rhapsody</strong></p>
                  <span className="activity-time">Hace 3 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*sección de estadísticas*/}
      <div className="content-section">
        <h2>Estadísticas Generales</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>Total Usuarios</h3>
              <div className="stat-number">1,247</div>
              <div className="stat-change positive">+12% este mes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-music"></i>
            </div>
            <div className="stat-info">
              <h3>Productos en Stock</h3>
              <div className="stat-number">3,456</div>
              <div className="stat-change positive">+8% este mes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div className="stat-info">
              <h3>Ventas del Mes</h3>
              <div className="stat-number">892</div>
              <div className="stat-change positive">+15% este mes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-info">
              <h3>Ingresos Totales</h3>
              <div className="stat-number">$45,678</div>
              <div className="stat-change positive">+22% este mes</div>
            </div>
          </div>
        </div>
      </div>

      {/*sección de acciones rápidas*/}
      <div className="content-section">
        <h2>Acciones Rápidas</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-base btn-primary"
            onClick={() => navigate('/admin/products/new')}
          >
            <i className="fas fa-plus"></i>
            Nuevo Producto
          </button>
          <button 
            className="btn-base btn-primary"
            onClick={() => navigate('/admin/users/new')}
          >
            <i className="fas fa-user-plus"></i>
            Nuevo Usuario
          </button>
          <button 
            className="btn-base btn-secondary"
            onClick={() => navigate('/admin/inventory')}
          >
            <i className="fas fa-warehouse"></i>
            Ver Inventario
          </button>
          <button 
            className="btn-base btn-secondary"
            onClick={() => navigate('/admin/users')}
          >
            <i className="fas fa-users"></i>
            Ver Usuarios
          </button>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default Dashboard;