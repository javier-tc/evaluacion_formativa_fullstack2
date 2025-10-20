import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../components/AdminLayout';

const Boletas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  //datos simulados de boletas
  const boletas = [
    {
      id: 'B001',
      numero: '0001',
      fecha: '25/01/2025',
      cliente: 'María González',
      email: 'maria.gonzalez@duocuc.cl',
      total: 75000,
      estado: 'pagada',
      productos: [
        { nombre: 'Led Zeppelin IV', cantidad: 1, precio: 25000 },
        { nombre: 'Back To Black', cantidad: 1, precio: 30000 },
        { nombre: 'Dark Side of the Moon', cantidad: 1, precio: 20000 }
      ]
    },
    {
      id: 'B002',
      numero: '0002',
      fecha: '24/01/2025',
      cliente: 'Carlos Ruiz',
      email: 'carlos.ruiz@duocuc.cl',
      total: 40000,
      estado: 'pendiente',
      productos: [
        { nombre: 'Abbey Road', cantidad: 1, precio: 40000 }
      ]
    },
    {
      id: 'B003',
      numero: '0003',
      fecha: '23/01/2025',
      cliente: 'Ana Silva',
      email: 'ana.silva@duocuc.cl',
      total: 28000,
      estado: 'pagada',
      productos: [
        { nombre: 'Plastic Beach', cantidad: 1, precio: 28000 }
      ]
    },
    {
      id: 'B004',
      numero: '0004',
      fecha: '22/01/2025',
      cliente: 'Luis Mendoza',
      email: 'luis.mendoza@duocuc.cl',
      total: 55000,
      estado: 'cancelada',
      productos: [
        { nombre: 'Led Zeppelin IV', cantidad: 1, precio: 25000 },
        { nombre: 'Back To Black', cantidad: 1, precio: 30000 }
      ]
    }
  ];

  //filtrar boletas
  const filteredBoletas = boletas.filter(boleta => {
    const matchesSearch = boleta.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boleta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         boleta.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || boleta.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewBoleta = (id) => {
    console.log('Ver boleta:', id);
    //aquí se podría abrir un modal o navegar a una página de detalle
  };

  const handleDownloadBoleta = (id) => {
    console.log('Descargar boleta:', id);
    //aquí iría la lógica para descargar la boleta en PDF
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'pagada':
        return <span className="status-badge active">Pagada</span>;
      case 'pendiente':
        return <span className="status-badge warning">Pendiente</span>;
      case 'cancelada':
        return <span className="status-badge inactive">Cancelada</span>;
      default:
        return <span className="status-badge active">Pagada</span>;
    }
  };

  const headerActions = (
    <div className="header-actions">
      <button 
        className="btn-base btn-secondary"
        onClick={() => console.log('Generar reporte de boletas')}
      >
        <i className="fas fa-chart-bar"></i>
        Reporte
      </button>
      <button 
        className="btn-base btn-primary"
        onClick={() => console.log('Nueva boleta')}
      >
        <i className="fas fa-plus"></i>
        Nueva Boleta
      </button>
    </div>
  );

  return (
    <AdminPageLayout title="Gestión de Boletas" headerActions={headerActions}>
      <div className="content-section">
        <div className="section-header">
          <h2>Boletas Generadas</h2>
          <div className="search-filter">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Buscar boletas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pagada">Pagada</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="boletas-table-container">
          <table className="boletas-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoletas.map(boleta => (
                <tr key={boleta.id}>
                  <td>
                    <div className="boleta-info">
                      <span className="boleta-numero">#{boleta.numero}</span>
                      <span className="boleta-id">{boleta.id}</span>
                    </div>
                  </td>
                  <td>{boleta.fecha}</td>
                  <td>
                    <div className="cliente-info">
                      <p className="cliente-nombre">{boleta.cliente}</p>
                    </div>
                  </td>
                  <td>{boleta.email}</td>
                  <td>${boleta.total.toLocaleString()}</td>
                  <td>{getStatusBadge(boleta.estado)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view" 
                        onClick={() => handleViewBoleta(boleta.id)}
                        title="Ver Boleta"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="btn-download" 
                        onClick={() => handleDownloadBoleta(boleta.id)}
                        title="Descargar Boleta"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pagination-btn" disabled>
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagination-info">Página 1 de 1</span>
          <button className="pagination-btn" disabled>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default Boletas;
