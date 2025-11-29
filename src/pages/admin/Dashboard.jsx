import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';
import { usuariosService, productosService, ordenesService } from '../../services/api.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalProductos: 0,
    productosEnStock: 0,
    totalOrdenesMes: 0,
    ingresosMes: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usuarios, productos, ordenes] = await Promise.all([
          usuariosService.getAll(),
          productosService.getAll(),
          ordenesService.getAll()
        ]);

        const totalUsuarios = Array.isArray(usuarios) ? usuarios.length : 0;
        const usuariosActivos = Array.isArray(usuarios)
          ? usuarios.filter((u) => u.activo !== false).length
          : 0;

        const totalProductos = Array.isArray(productos) ? productos.length : 0;
        const productosEnStock = Array.isArray(productos)
          ? productos.reduce((acc, p) => acc + (p.stock || 0), 0)
          : 0;

        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const añoActual = ahora.getFullYear();

        const ordenesMes = Array.isArray(ordenes)
          ? ordenes.filter((o) => {
              const fechaStr = o.fecha || o.fechaOrden || o.createdAt;
              if (!fechaStr) return false;
              const fecha = new Date(fechaStr);
              return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
            })
          : [];

        const totalOrdenesMes = ordenesMes.length;
        const ingresosMes = ordenesMes.reduce((acc, o) => {
          const total =
            o.total ||
            o.totalOrden ||
            o.montoTotal ||
            0;
          return acc + total;
        }, 0);

        const recentUsersData = Array.isArray(usuarios)
          ? [...usuarios]
              .sort((a, b) => new Date(b.fechaRegistro || b.createdAt || 0) - new Date(a.fechaRegistro || a.createdAt || 0))
              .slice(0, 3)
              .map((u) => ({
                id: u.id,
                nombre: `${u.nombre || ''} ${u.apellidos || ''}`.trim() || u.name || u.email,
                fecha: u.fechaRegistro || (u.createdAt && new Date(u.createdAt).toLocaleDateString('es-CL'))
              }))
          : [];

        const recentProductsData = Array.isArray(productos)
          ? [...productos]
              .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              .slice(0, 3)
              .map((p) => ({
                id: p.id,
                nombre: p.nombre || p.name,
                artista: p.artista || p.artist
              }))
          : [];

        setStats({
          totalUsuarios,
          usuariosActivos,
          totalProductos,
          productosEnStock,
          totalOrdenesMes,
          ingresosMes
        });
        setRecentUsers(recentUsersData);
        setRecentProducts(recentProductsData);
      } catch (error) {
        console.error('Error al cargar datos de dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
              {loading && (
                <div className="activity-item">
                  <div className="activity-details">
                    <p className="activity-text">
                      Cargando usuarios...
                    </p>
                  </div>
                </div>
              )}
              {!loading && recentUsers.length === 0 && (
                <div className="activity-item">
                  <div className="activity-details">
                    <p className="activity-text">
                      No hay usuarios registrados aún.
                    </p>
                  </div>
                </div>
              )}
              {!loading && recentUsers.map((u) => (
                <div className="activity-item" key={u.id}>
                  <div className="activity-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      Nuevo usuario: <strong>{u.nombre}</strong>
                    </p>
                    {u.fecha && (
                      <span className="activity-time">{u.fecha}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="activity-card">
            <h3>Últimos Productos Agregados</h3>
            <div className="activity-list">
              {loading && (
                <div className="activity-item">
                  <div className="activity-details">
                    <p className="activity-text">
                      Cargando productos...
                    </p>
                  </div>
                </div>
              )}
              {!loading && recentProducts.length === 0 && (
                <div className="activity-item">
                  <div className="activity-details">
                    <p className="activity-text">
                      No hay productos registrados aún.
                    </p>
                  </div>
                </div>
              )}
              {!loading && recentProducts.map((p) => (
                <div className="activity-item" key={p.id}>
                  <div className="activity-avatar">
                    <i className="fas fa-music"></i>
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">
                      Nuevo producto: <strong>{p.artista} - {p.nombre}</strong>
                    </p>
                  </div>
                </div>
              ))}
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
              <div className="stat-number">{stats.totalUsuarios}</div>
              <div className="stat-change positive">Activos: {stats.usuariosActivos}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-music"></i>
            </div>
            <div className="stat-info">
              <h3>Productos en Stock</h3>
              <div className="stat-number">{stats.totalProductos}</div>
              <div className="stat-change positive">Unidades: {stats.productosEnStock}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div className="stat-info">
              <h3>Ventas del Mes</h3>
              <div className="stat-number">{stats.totalOrdenesMes}</div>
              <div className="stat-change positive">Órdenes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-info">
              <h3>Ingresos Totales</h3>
              <div className="stat-number">${stats.ingresosMes.toLocaleString()}</div>
              <div className="stat-change positive">Mes actual</div>
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