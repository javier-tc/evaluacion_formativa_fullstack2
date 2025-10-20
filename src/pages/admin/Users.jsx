import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  //datos simulados de usuarios
  const users = [
    {
      id: 1,
      name: 'María González',
      username: '@mariagonzalez',
      email: 'maria.gonzalez@duocuc.cl',
      role: 'user',
      status: 'active',
      registrationDate: '15/01/2025',
      purchaseHistory: [
        { id: 'B001', fecha: '25/01/2025', total: 75000, productos: 3, estado: 'pagada' },
        { id: 'B005', fecha: '20/01/2025', total: 30000, productos: 1, estado: 'pagada' }
      ]
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      username: '@carlosruiz',
      email: 'carlos.ruiz@duocuc.cl',
      role: 'admin',
      status: 'active',
      registrationDate: '10/01/2025',
      purchaseHistory: [
        { id: 'B002', fecha: '24/01/2025', total: 40000, productos: 1, estado: 'pendiente' }
      ]
    },
    {
      id: 3,
      name: 'Ana Silva',
      username: '@anasilva',
      email: 'ana.silva@duocuc.cl',
      role: 'moderator',
      status: 'inactive',
      registrationDate: '05/01/2025',
      purchaseHistory: [
        { id: 'B003', fecha: '23/01/2025', total: 28000, productos: 1, estado: 'pagada' }
      ]
    },
    {
      id: 4,
      name: 'Luis Mendoza',
      username: '@luismendoza',
      email: 'luis.mendoza@duocuc.cl',
      role: 'user',
      status: 'active',
      registrationDate: '20/01/2025',
      purchaseHistory: [
        { id: 'B004', fecha: '22/01/2025', total: 55000, productos: 2, estado: 'cancelada' }
      ]
    },
    {
      id: 5,
      name: 'Patricia López',
      username: '@patricialopez',
      email: 'patricia.lopez@duocuc.cl',
      role: 'user',
      status: 'active',
      registrationDate: '18/01/2025',
      purchaseHistory: []
    }
  ];

  //filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      console.log('Eliminar usuario:', id);
      //aquí iría la lógica para eliminar el usuario
    }
  };

  const handleViewHistory = (user) => {
    setSelectedUser(user);
  };

  const closeHistoryModal = () => {
    setSelectedUser(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">Activo</span>;
      case 'inactive':
        return <span className="status-badge inactive">Inactivo</span>;
      default:
        return <span className="status-badge active">Activo</span>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="role-badge admin">Administrador</span>;
      case 'moderator':
        return <span className="role-badge moderator">Moderador</span>;
      case 'user':
        return <span className="role-badge user">Usuario</span>;
      default:
        return <span className="role-badge user">Usuario</span>;
    }
  };

  const headerActions = (
    <button 
      className="btn-base btn-primary"
      onClick={() => navigate('/admin/users/new')}
    >
      <i className="fas fa-plus"></i>
      Nuevo Usuario
    </button>
  );

  return (
    <AdminPageLayout title="Gestión de Usuarios" headerActions={headerActions}>
      <div className="content-section">
        <div className="section-header">
          <h2>Listado de Usuarios</h2>
          <div className="search-filter">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Buscar usuarios..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
              <option value="moderator">Moderador</option>
            </select>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <p className="user-name">{user.name}</p>
                        <p className="user-username">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{user.registrationDate}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-history" 
                        onClick={() => handleViewHistory(user)}
                        title="Ver Historial de Compras"
                      >
                        <i className="fas fa-history"></i>
                      </button>
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditUser(user.id)}
                        title="Editar Usuario"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteUser(user.id)}
                        title="Eliminar Usuario"
                      >
                        <i className="fas fa-trash"></i>
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

      {/*modal de historial de compras*/}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeHistoryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Historial de Compras - {selectedUser.name}</h3>
              <button className="modal-close" onClick={closeHistoryModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {selectedUser.purchaseHistory.length > 0 ? (
                <div className="purchase-history">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Boleta</th>
                        <th>Fecha</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.purchaseHistory.map(purchase => (
                        <tr key={purchase.id}>
                          <td>#{purchase.id}</td>
                          <td>{purchase.fecha}</td>
                          <td>{purchase.productos}</td>
                          <td>${purchase.total.toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${purchase.estado === 'pagada' ? 'active' : purchase.estado === 'pendiente' ? 'warning' : 'inactive'}`}>
                              {purchase.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-history">
                  <i className="fas fa-shopping-cart"></i>
                  <p>Este usuario no tiene compras registradas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default Users;