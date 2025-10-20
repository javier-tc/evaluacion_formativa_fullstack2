import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';
import { regionesComunas } from '../../data/regiones-comunas';

const NewUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    run: '',
    firstName: '',
    lastName: '',
    email: '',
    fechaNacimiento: '',
    tipoUsuario: '',
    region: '',
    comuna: '',
    direccion: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [comunasOptions, setComunasOptions] = useState([]);

  useEffect(() => {
    if (formData.region) {
      const selectedRegion = regionesComunas.find((r) => r.region === formData.region);
      setComunasOptions(selectedRegion ? selectedRegion.comunas : []);
    } else {
      setComunasOptions([]);
    }
  }, [formData.region]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'run':
        if (!value.trim()) error = 'El RUN es obligatorio';
        else if (!/^\d{7,8}[-][0-9Kk]$/.test(value)) error = 'Formato de RUN inválido (ej: 12345678-K)';
        break;
      case 'firstName':
        if (!value.trim()) error = 'El nombre es obligatorio';
        else if (value.length > 50) error = 'El nombre no puede exceder 50 caracteres';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Los apellidos son obligatorios';
        else if (value.length > 100) error = 'Los apellidos no pueden exceder 100 caracteres';
        break;
      case 'email':
        if (!value.trim()) error = 'El correo es obligatorio';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Formato de correo inválido';
        else if (value.length > 100) error = 'El correo no puede exceder 100 caracteres';
        break;
      case 'fechaNacimiento':
        break;
      case 'tipoUsuario':
        if (!value) error = 'El tipo de usuario es obligatorio';
        break;
      case 'region':
        if (!value) error = 'La región es obligatoria';
        break;
      case 'comuna':
        if (!value) error = 'La comuna es obligatoria';
        break;
      case 'direccion':
        if (!value.trim()) error = 'La dirección es obligatoria';
        else if (value.length > 300) error = 'La dirección no puede exceder 300 caracteres';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    const newErrors = {};

    for (const key in formData) {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        formIsValid = false;
      }
    }
    setErrors(newErrors);

    if (formIsValid) {
      setLoading(true);
      setMessage('');
      setMessageType('');
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Usuario a crear:', formData);
        setMessage(`¡Usuario "${formData.firstName} ${formData.lastName}" creado exitosamente!`);
        setMessageType('success');
        setFormData({
          run: '',
          firstName: '',
          lastName: '',
          email: '',
          fechaNacimiento: '',
          tipoUsuario: '',
          region: '',
          comuna: '',
          direccion: '',
        });
        setErrors({});
        setTimeout(() => navigate('/admin/users'), 1500);
      } catch (error) {
        setMessage('Error al crear el usuario.');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    } else {
      setMessage('Por favor, corrige los errores en el formulario.');
      setMessageType('error');
    }
  };

  const headerActions = (
    <button className="btn-base btn-secondary" onClick={() => navigate('/admin/users')}>
      <i className="fas fa-arrow-left"></i>
      Volver
    </button>
  );

  return (
    <AdminPageLayout title="Nuevo Usuario" headerActions={headerActions}>
      <div className="content-section">
        {message && (
          <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>&times;</button>
          </div>
        )}
        <div className="form-container-admin">
          <form id="newUserForm" className="admin-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className={`form-group ${errors.run ? 'error' : ''}`}>
                <label htmlFor="run">RUN *</label>
                <input
                  type="text"
                  id="run"
                  name="run"
                  value={formData.run}
                  onChange={handleChange}
                  required
                  minLength="7"
                  maxLength="9"
                  placeholder="Ej: 19011022K"
                />
                <span className="error-message">{errors.run}</span>
              </div>

              <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                <label htmlFor="firstName">Nombre *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  maxLength="50"
                />
                <span className="error-message">{errors.firstName}</span>
              </div>

              <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
                <label htmlFor="lastName">Apellidos *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  maxLength="100"
                />
                <span className="error-message">{errors.lastName}</span>
              </div>

              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label htmlFor="email">Correo *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength="100"
                />
                <span className="error-message">{errors.email}</span>
              </div>

              <div className={`form-group ${errors.fechaNacimiento ? 'error' : ''}`}>
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
                <span className="error-message">{errors.fechaNacimiento}</span>
              </div>

              <div className={`form-group ${errors.tipoUsuario ? 'error' : ''}`}>
                <label htmlFor="tipoUsuario">Tipo de Usuario *</label>
                <select id="tipoUsuario" name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange} required>
                  <option value="">Seleccionar tipo</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Cliente">Cliente</option>
                  <option value="Vendedor">Vendedor</option>
                </select>
                <span className="error-message">{errors.tipoUsuario}</span>
              </div>

              <div className={`form-group ${errors.region ? 'error' : ''}`}>
                <label htmlFor="region">Región *</label>
                <select id="region" name="region" value={formData.region} onChange={handleChange} required>
                  <option value="">Seleccionar región</option>
                  {regionesComunas.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.region}
                    </option>
                  ))}
                </select>
                <span className="error-message">{errors.region}</span>
              </div>

              <div className={`form-group ${errors.comuna ? 'error' : ''}`}>
                <label htmlFor="comuna">Comuna *</label>
                <select id="comuna" name="comuna" value={formData.comuna} onChange={handleChange} required disabled={!formData.region}>
                  <option value="">Seleccionar comuna</option>
                  {comunasOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="error-message">{errors.comuna}</span>
              </div>

              <div className={`form-group full-width ${errors.direccion ? 'error' : ''}`}>
                <label htmlFor="direccion">Dirección *</label>
                <textarea
                  id="direccion"
                  name="direccion"
                  rows="3"
                  required
                  maxLength="300"
                  placeholder="Dirección completa"
                  value={formData.direccion}
                  onChange={handleChange}
                ></textarea>
                <span className="error-message">{errors.direccion}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-base btn-secondary" onClick={() => navigate('/admin/users')}>
                Cancelar
              </button>
              <button type="submit" className="btn-base btn-primary" disabled={loading}>
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default NewUser;