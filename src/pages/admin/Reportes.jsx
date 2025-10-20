import React, { useState } from 'react';
import AdminPageLayout from '../../components/AdminLayout';

const Reportes = () => {
  const [activeReport, setActiveReport] = useState('ventas');

  //datos simulados para reportes
  const reportData = {
    ventas: {
      title: 'Reporte de Ventas',
      icon: 'fas fa-chart-line',
      data: [
        { periodo: 'Enero 2025', ventas: 1250000, productos: 45 },
        { periodo: 'Diciembre 2024', ventas: 980000, productos: 38 },
        { periodo: 'Noviembre 2024', ventas: 1100000, productos: 42 }
      ]
    },
    productos: {
      title: 'Reporte de Productos',
      icon: 'fas fa-box',
      data: [
        { categoria: 'Rock', cantidad: 25, vendidos: 18 },
        { categoria: 'Pop', cantidad: 15, vendidos: 12 },
        { categoria: 'Jazz', cantidad: 8, vendidos: 5 },
        { categoria: 'Clásica', cantidad: 12, vendidos: 7 }
      ]
    },
    usuarios: {
      title: 'Reporte de Usuarios',
      icon: 'fas fa-users',
      data: [
        { tipo: 'Usuarios Activos', cantidad: 150 },
        { tipo: 'Usuarios Nuevos (mes)', cantidad: 25 },
        { tipo: 'Administradores', cantidad: 3 },
        { tipo: 'Moderadores', cantidad: 2 }
      ]
    },
    inventario: {
      title: 'Reporte de Inventario',
      icon: 'fas fa-warehouse',
      data: [
        { estado: 'Stock Normal', cantidad: 45 },
        { estado: 'Stock Bajo', cantidad: 8 },
        { estado: 'Sin Stock', cantidad: 3 },
        { estado: 'Productos Inactivos', cantidad: 5 }
      ]
    }
  };

  const handleGenerateReport = (type) => {
    console.log(`Generando reporte de ${type}`);
    //aquí iría la lógica para generar y descargar el reporte
  };

  const handleExportData = (type) => {
    console.log(`Exportando datos de ${type}`);
    //aquí iría la lógica para exportar los datos
  };

  const renderReportContent = () => {
    const currentData = reportData[activeReport];
    
    return (
      <div className="report-content">
        <div className="report-header">
          <div className="report-title">
            <i className={currentData.icon}></i>
            <h3>{currentData.title}</h3>
          </div>
          <div className="report-actions">
            <button 
              className="btn-base btn-secondary"
              onClick={() => handleExportData(activeReport)}
            >
              <i className="fas fa-download"></i>
              Exportar
            </button>
            <button 
              className="btn-base btn-primary"
              onClick={() => handleGenerateReport(activeReport)}
            >
              <i className="fas fa-file-pdf"></i>
              Generar PDF
            </button>
          </div>
        </div>

        <div className="report-stats">
          {activeReport === 'ventas' && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-info">
                  <h4>Total Ventas</h4>
                  <p>$3,330,000</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-info">
                  <h4>Productos Vendidos</h4>
                  <p>125</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <div className="stat-info">
                  <h4>Promedio por Venta</h4>
                  <p>$26,640</p>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'productos' && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-box"></i>
                </div>
                <div className="stat-info">
                  <h4>Total Productos</h4>
                  <p>60</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h4>Productos Vendidos</h4>
                  <p>42</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-percentage"></i>
                </div>
                <div className="stat-info">
                  <h4>Tasa de Venta</h4>
                  <p>70%</p>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'usuarios' && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h4>Total Usuarios</h4>
                  <p>180</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="stat-info">
                  <h4>Nuevos este Mes</h4>
                  <p>25</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="stat-info">
                  <h4>Usuarios Activos</h4>
                  <p>150</p>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'inventario' && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-warehouse"></i>
                </div>
                <div className="stat-info">
                  <h4>Total Productos</h4>
                  <p>61</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="stat-info">
                  <h4>Stock Crítico</h4>
                  <p>11</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-times-circle"></i>
                </div>
                <div className="stat-info">
                  <h4>Sin Stock</h4>
                  <p>3</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                {activeReport === 'ventas' && (
                  <>
                    <th>Período</th>
                    <th>Ventas</th>
                    <th>Productos Vendidos</th>
                  </>
                )}
                {activeReport === 'productos' && (
                  <>
                    <th>Categoría</th>
                    <th>En Stock</th>
                    <th>Vendidos</th>
                  </>
                )}
                {activeReport === 'usuarios' && (
                  <>
                    <th>Tipo de Usuario</th>
                    <th>Cantidad</th>
                  </>
                )}
                {activeReport === 'inventario' && (
                  <>
                    <th>Estado</th>
                    <th>Cantidad</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentData.data.map((item, index) => (
                <tr key={index}>
                  {activeReport === 'ventas' && (
                    <>
                      <td>{item.periodo}</td>
                      <td>${item.ventas.toLocaleString()}</td>
                      <td>{item.productos}</td>
                    </>
                  )}
                  {activeReport === 'productos' && (
                    <>
                      <td>{item.categoria}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.vendidos}</td>
                    </>
                  )}
                  {activeReport === 'usuarios' && (
                    <>
                      <td>{item.tipo}</td>
                      <td>{item.cantidad}</td>
                    </>
                  )}
                  {activeReport === 'inventario' && (
                    <>
                      <td>{item.estado}</td>
                      <td>{item.cantidad}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <AdminPageLayout title="Reportes y Análisis">
      <div className="content-section">
        <div className="reports-container">
          <div className="reports-sidebar">
            <h3>Tipos de Reportes</h3>
            <div className="report-types">
              <button 
                className={`report-type ${activeReport === 'ventas' ? 'active' : ''}`}
                onClick={() => setActiveReport('ventas')}
              >
                <i className="fas fa-chart-line"></i>
                Ventas
              </button>
              <button 
                className={`report-type ${activeReport === 'productos' ? 'active' : ''}`}
                onClick={() => setActiveReport('productos')}
              >
                <i className="fas fa-box"></i>
                Productos
              </button>
              <button 
                className={`report-type ${activeReport === 'usuarios' ? 'active' : ''}`}
                onClick={() => setActiveReport('usuarios')}
              >
                <i className="fas fa-users"></i>
                Usuarios
              </button>
              <button 
                className={`report-type ${activeReport === 'inventario' ? 'active' : ''}`}
                onClick={() => setActiveReport('inventario')}
              >
                <i className="fas fa-warehouse"></i>
                Inventario
              </button>
            </div>
          </div>

          <div className="reports-main">
            {renderReportContent()}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default Reportes;
