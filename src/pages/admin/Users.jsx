import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';
import { usuariosService, ordenesService } from '../../services/api.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const Users = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapOrdenToHistoryItem = (orden) => {
    const total =
      orden.total ||
      orden.totalOrden ||
      orden.montoTotal ||
      0;
    const productosCount =
      (Array.isArray(orden.detalle) && orden.detalle.length) ||
      (Array.isArray(orden.items) && orden.items.length) ||
      orden.cantidadProductos ||
      0;
    const fecha =
      orden.fecha ||
      orden.fechaOrden ||
      orden.createdAt ||
      '';
    const estado =
      orden.estado ||
      orden.status ||
      'desconocido';

    return {
      id: orden.id,
      fecha,
      total,
      productos: productosCount,
      estado
    };
  };

  const mapUsuarioToRow = (user, purchaseHistory) => {
    const nombreCompleto = `${user.nombre || ''} ${user.apellidos || ''}`.trim() || user.name || '';
    const username =
      user.username ||
      (user.email ? `@${user.email.split('@')[0]}` : '');
    const rol = user.rol || user.role || 'user';
    const activo = typeof user.activo === 'boolean' ? user.activo : true;
    const status = activo ? 'active' : 'inactive';
    const registrationDate =
      user.fechaRegistro ||
      user.registrationDate ||
      (user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CL') : '');

    return {
      id: user.id,
      name: nombreCompleto,
      username,
      email: user.email,
      role: rol === 'Administrador' ? 'admin' : rol,
      status,
      registrationDate,
      purchaseHistory
    };
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const usuariosData = await usuariosService.getAll();
        const usersWithHistory = await Promise.all(
          usuariosData.map(async (user) => {
            try {
              const ordenes = await ordenesService.getAll(user.id);
              const history = Array.isArray(ordenes)
                ? ordenes.map(mapOrdenToHistoryItem)
                : [];
              return mapUsuarioToRow(user, history);
            } catch (error) {
              return mapUsuarioToRow(user, []);
            }
          })
        );
        setUsers(usersWithHistory);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        toast.error('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [toast]);

  const filteredUsers = users.filter(user => {
    const nombre = user.name || '';
    const email = user.email || '';
    const username = user.username || '';
    const rol = user.role || '';
    const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || rol === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await usuariosService.delete(id);
        toast.success('Usuario eliminado exitosamente');
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        toast.error('Error al eliminar usuario');
      }
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
              {loading && (
                <tr>
                  <td colSpan="7" className="text-center">
                    <i className="fas fa-spinner fa-spin"></i> Cargando usuarios...
                  </td>
                </tr>
              )}
              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
              {!loading && filteredUsers.map(user => (
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