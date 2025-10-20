import React, { useState } from 'react';
import AdminPageLayout from '../../components/AdminLayout';

const Perfil = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isEditing, setIsEditing] = useState(false);
  
  //datos simulados del administrador
  const [adminData, setAdminData] = useState({
    id: 1,
    name: 'Carlos Ruiz',
    username: '@carlosruiz',
    email: 'carlos.ruiz@duocuc.cl',
    role: 'admin',
    phone: '+56 9 1234 5678',
    address: 'Av. Providencia 1234, Santiago',
    registrationDate: '10/01/2025',
    lastLogin: '25/01/2025 14:30',
    avatar: null
  });

  const [formData, setFormData] = useState({ ...adminData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    setAdminData(formData);
    setIsEditing(false);
    console.log('Perfil actualizado:', formData);
  };

  const handleCancelEdit = () => {
    setFormData(adminData);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    console.log('Cambiar contraseña');
    //aquí iría la lógica para cambiar contraseña
  };

  const handleUploadAvatar = () => {
    console.log('Subir avatar');
    //aquí iría la lógica para subir avatar
  };

  const renderProfileTab = () => (
    <div className="profile-content">
      <div className="profile-header">
        <div className="profile-avatar">
          {adminData.avatar ? (
            <img src={adminData.avatar} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
          <button 
            className="btn-avatar-upload"
            onClick={handleUploadAvatar}
          >
            <i className="fas fa-camera"></i>
          </button>
        </div>
        <div className="profile-info">
          <h2>{adminData.name}</h2>
          <p className="profile-role">{adminData.role.charAt(0).toUpperCase() + adminData.role.slice(1)}</p>
          <p className="profile-username">{adminData.username}</p>
        </div>
      </div>

      <div className="profile-form">
        <div className="form-section">
          <h3>Información Personal</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Información de Cuenta</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Usuario</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <input 
                type="text" 
                value={formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Fecha de Registro</label>
              <input 
                type="text" 
                value={formData.registrationDate}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Último Acceso</label>
              <input 
                type="text" 
                value={formData.lastLogin}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          {!isEditing ? (
            <button 
              className="btn-base btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
              Editar Perfil
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn-base btn-success"
                onClick={handleSaveProfile}
              >
                <i className="fas fa-save"></i>
                Guardar Cambios
              </button>
              <button 
                className="btn-base btn-secondary"
                onClick={handleCancelEdit}
              >
                <i className="fas fa-times"></i>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="security-content">
      <div className="security-section">
        <h3>Cambiar Contraseña</h3>
        <div className="password-form">
          <div className="form-group">
            <label>Contraseña Actual</label>
            <input type="password" placeholder="Ingresa tu contraseña actual" />
          </div>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input type="password" placeholder="Ingresa tu nueva contraseña" />
          </div>
          <div className="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input type="password" placeholder="Confirma tu nueva contraseña" />
          </div>
          <button 
            className="btn-base btn-primary"
            onClick={handleChangePassword}
          >
            <i className="fas fa-key"></i>
            Cambiar Contraseña
          </button>
        </div>
      </div>

      <div className="security-section">
        <h3>Sesión Actual</h3>
        <div className="session-info">
          <div className="session-item">
            <span className="session-label">IP de Conexión:</span>
            <span className="session-value">192.168.1.100</span>
          </div>
          <div className="session-item">
            <span className="session-label">Navegador:</span>
            <span className="session-value">Chrome 120.0.0.0</span>
          </div>
          <div className="session-item">
            <span className="session-label">Sistema Operativo:</span>
            <span className="session-value">Windows 10</span>
          </div>
          <div className="session-item">
            <span className="session-label">Última Actividad:</span>
            <span className="session-value">Hace 5 minutos</span>
          </div>
        </div>
      </div>

      <div className="security-section">
        <h3>Configuración de Seguridad</h3>
        <div className="security-options">
          <div className="security-option">
            <div className="option-info">
              <h4>Autenticación de Dos Factores</h4>
              <p>Agrega una capa extra de seguridad a tu cuenta</p>
            </div>
            <button className="btn-base btn-secondary">
              Configurar
            </button>
          </div>
          <div className="security-option">
            <div className="option-info">
              <h4>Notificaciones de Seguridad</h4>
              <p>Recibe alertas sobre accesos sospechosos</p>
            </div>
            <button className="btn-base btn-secondary">
              Activar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminPageLayout title="Mi Perfil">
      <div className="content-section">
        <div className="profile-container">
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              <i className="fas fa-user"></i>
              Perfil
            </button>
            <button 
              className={`profile-tab ${activeTab === 'seguridad' ? 'active' : ''}`}
              onClick={() => setActiveTab('seguridad')}
            >
              <i className="fas fa-shield-alt"></i>
              Seguridad
            </button>
          </div>

          <div className="profile-content-container">
            {activeTab === 'perfil' && renderProfileTab()}
            {activeTab === 'seguridad' && renderSecurityTab()}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default Perfil;
