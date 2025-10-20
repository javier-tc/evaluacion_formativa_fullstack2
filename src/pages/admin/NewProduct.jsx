import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';

const NewProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigoProducto: '',
    productName: '',
    description: '',
    price: '',
    stock: '',
    stockCritico: '',
    category: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'codigoProducto':
        if (!value.trim()) error = 'El código producto es obligatorio';
        else if (value.length < 3) error = 'El código producto debe tener al menos 3 caracteres';
        break;
      case 'productName':
        if (!value.trim()) error = 'El nombre es obligatorio';
        else if (value.length > 100) error = 'El nombre no puede exceder 100 caracteres';
        break;
      case 'description':
        if (value.length > 500) error = 'La descripción no puede exceder 500 caracteres';
        break;
      case 'price':
        if (value === '' || value === null) error = 'El precio es obligatorio';
        else if (isNaN(parseFloat(value))) error = 'El precio debe ser un número válido';
        else if (parseFloat(value) < 0) error = 'El precio no puede ser negativo';
        break;
      case 'stock':
        if (value === '' || value === null) error = 'El stock es obligatorio';
        else if (isNaN(parseInt(value))) error = 'El stock debe ser un número entero válido';
        else if (parseInt(value) < 0) error = 'El stock no puede ser negativo';
        break;
      case 'stockCritico':
        if (value !== '' && value !== null) {
          if (isNaN(parseInt(value))) error = 'El stock crítico debe ser un número entero válido';
          else if (parseInt(value) < 0) error = 'El stock crítico no puede ser negativo';
          else if (formData.stock !== '' && parseInt(value) > parseInt(formData.stock)) {
            error = 'El stock crítico no puede ser mayor al stock disponible';
          }
        }
        break;
      case 'category':
        if (!value) error = 'La categoría es obligatoria';
        break;
      case 'imageUrl':
        if (value.trim() !== '') {
          const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
          if (!urlRegex.test(value)) error = 'La URL debe ser válida y apuntar a una imagen (jpg, png, gif, webp)';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      // Re-validate stockCritico if stock changes
      if (name === 'stock') {
        const stockCriticoError = validateField('stockCritico', newData.stockCritico);
        setErrors((prevErrors) => ({ ...prevErrors, stockCritico: stockCriticoError }));
      }
      return newData;
    });
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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Producto a crear:', formData);
        setMessage(`¡Producto "${formData.productName}" creado exitosamente!`);
        setMessageType('success');
        setFormData({
          codigoProducto: '',
          productName: '',
          description: '',
          price: '',
          stock: '',
          stockCritico: '',
          category: '',
          imageUrl: '',
        });
        setErrors({});
        setTimeout(() => navigate('/admin/inventory'), 1500);
      } catch (error) {
        setMessage('Error al crear el producto.');
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
    <button className="btn-base btn-secondary" onClick={() => navigate('/admin/inventory')}>
      <i className="fas fa-arrow-left"></i>
      Volver al Inventario
    </button>
  );

  return (
    <AdminPageLayout title="Nuevo Producto" headerActions={headerActions}>
      <div className="content-section">
        {message && (
          <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message}
            <button onClick={() => setMessage('')}>&times;</button>
          </div>
        )}
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className={`form-group ${errors.codigoProducto ? 'error' : ''}`}>
              <label htmlFor="codigoProducto">Código Producto *</label>
              <input
                type="text"
                id="codigoProducto"
                name="codigoProducto"
                value={formData.codigoProducto}
                onChange={handleChange}
                required
                minLength="3"
              />
              <span className="error-message">{errors.codigoProducto}</span>
            </div>

            <div className={`form-group ${errors.productName ? 'error' : ''}`}>
              <label htmlFor="productName">Nombre *</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                maxLength="100"
              />
              <span className="error-message">{errors.productName}</span>
            </div>

            <div className={`form-group ${errors.description ? 'error' : ''}`}>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                maxLength="500"
                placeholder="Descripción opcional del producto"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              <span className="error-message">{errors.description}</span>
            </div>

            <div className={`form-group ${errors.price ? 'error' : ''}`}>
              <label htmlFor="price">Precio *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
              <span className="error-message">{errors.price}</span>
            </div>

            <div className={`form-group ${errors.stock ? 'error' : ''}`}>
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
              <span className="error-message">{errors.stock}</span>
            </div>

            <div className={`form-group ${errors.stockCritico ? 'error' : ''}`}>
              <label htmlFor="stockCritico">Stock Crítico</label>
              <input
                type="number"
                id="stockCritico"
                name="stockCritico"
                value={formData.stockCritico}
                onChange={handleChange}
                min="0"
              />
              <span className="error-message">{errors.stockCritico}</span>
            </div>

            <div className={`form-group ${errors.category ? 'error' : ''}`}>
              <label htmlFor="category">Categorías *</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Seleccionar categoría</option>
                <option value="rock">Rock</option>
                <option value="jazz">Jazz</option>
                <option value="pop">Pop</option>
                <option value="clasica">Clásica</option>
                <option value="electronic">Electrónica</option>
                <option value="folk">Folk</option>
                <option value="blues">Blues</option>
                <option value="reggae">Reggae</option>
              </select>
              <span className="error-message">{errors.category}</span>
            </div>

            <div className={`form-group ${errors.imageUrl ? 'error' : ''}`}>
              <label htmlFor="imageUrl">Imagen</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                placeholder="URL de la imagen (opcional)"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <span className="error-message">{errors.imageUrl}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-base btn-secondary" onClick={() => navigate('/admin/inventory')}>
              Cancelar
            </button>
            <button type="submit" className="btn-base btn-primary" disabled={loading}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
};

export default NewProduct;