import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';
import { regionesComunas } from '../../data/regiones-comunas';
import { usuariosService } from '../../services/api.js';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    region: '',
    comuna: '',
    rol: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [comunasOptions, setComunasOptions] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await usuariosService.getById(id);
        const mapped = {
          nombre: user.nombre || '',
          apellido: user.apellido || user.apellidos || '',
          email: user.email || '',
          password: '',
          telefono: user.telefono || '',
          direccion: user.direccion || '',
          region: user.region || '',
          comuna: user.comuna || '',
          rol: user.rol || user.role || '',
        };
        setFormData(mapped);
      } catch (error) {
        setMessage('Error al cargar el usuario.');
        setMessageType('error');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchUser();
  }, [id]);

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
      case 'nombre':
        if (!value.trim()) error = 'El nombre es obligatorio';
        else if (value.length > 50) error = 'El nombre no puede exceder 50 caracteres';
        break;
      case 'apellido':
        if (!value.trim()) error = 'El apellido es obligatorio';
        else if (value.length > 100) error = 'El apellido no puede exceder 100 caracteres';
        break;
      case 'email':
        if (!value.trim()) error = 'El correo es obligatorio';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Formato de correo inválido';
        else if (value.length > 100) error = 'El correo no puede exceder 100 caracteres';
        break;
      case 'password':
        if (value && value.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'telefono':
        if (!value.trim()) error = 'El teléfono es obligatorio';
        break;
      case 'direccion':
        if (!value.trim()) error = 'La dirección es obligatoria';
        else if (value.length > 300) error = 'La dirección no puede exceder 300 caracteres';
        break;
      case 'region':
        if (!value) error = 'La región es obligatoria';
        break;
      case 'comuna':
        if (!value) error = 'La comuna es obligatoria';
        break;
      case 'rol':
        if (!value) error = 'El rol es obligatorio';
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
        const payload = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          region: formData.region,
          comuna: formData.comuna,
          rol: formData.rol,
        };
        if (formData.password) {
          payload.password = formData.password;
        }
        await usuariosService.update(id, payload);
        setMessage(`¡Usuario "${formData.nombre} ${formData.apellido}" actualizado exitosamente!`);
        setMessageType('success');
        setTimeout(() => navigate('/admin/users'), 1500);
      } catch (error) {
        setMessage('Error al actualizar el usuario.');
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

  if (loading && initialLoad) {
    return (
      <AdminPageLayout title="Cargando Usuario...">
        <div className="content-section text-center">
          <i className="fas fa-spinner fa-spin fa-3x"></i>
          <p className="mt-2">Cargando datos del usuario...</p>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Editar Usuario" headerActions={headerActions}>
      <div className="content-section">
        {message && (
          <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>&times;</button>
          </div>
        )}
        <div className="form-container-admin">
          <form id="editUserForm" className="admin-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className={`form-group ${errors.nombre ? 'error' : ''}`}>
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  maxLength="50"
                />
                <span className="error-message">{errors.nombre}</span>
              </div>

              <div className={`form-group ${errors.apellido ? 'error' : ''}`}>
                <label htmlFor="apellido">Apellido *</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  maxLength="100"
                />
                <span className="error-message">{errors.apellido}</span>
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

              <div className={`form-group ${errors.password ? 'error' : ''}`}>
                <label htmlFor="password">Contraseña (dejar en blanco para no cambiar)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                />
                <span className="error-message">{errors.password}</span>
              </div>

              <div className={`form-group ${errors.telefono ? 'error' : ''}`}>
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                <span className="error-message">{errors.telefono}</span>
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

              <div className={`form-group ${errors.rol ? 'error' : ''}`}>
                <label htmlFor="rol">Rol *</label>
                <select id="rol" name="rol" value={formData.rol} onChange={handleChange} required>
                  <option value="">Seleccionar rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Usuario">Usuario</option>
                </select>
                <span className="error-message">{errors.rol}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-base btn-secondary" onClick={() => navigate('/admin/users')}>
                Cancelar
              </button>
              <button type="submit" className="btn-base btn-primary" disabled={loading}>
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default EditUser;