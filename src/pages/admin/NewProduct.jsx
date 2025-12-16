import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';
import { productosService, categoriasService } from '../../services/api.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const NewProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    artista: '',
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
  const [categorias, setCategorias] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryError, setNewCategoryError] = useState('');
  const toast = useToast();

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const categoriasData = await categoriasService.getAll();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    loadCategorias();
  }, []);

  const handleCreateCategory = async () => {
    const nombre = newCategoryName.trim();
    if (!nombre) {
      setNewCategoryError('El nombre de la categoría es obligatorio');
      return;
    }
    setNewCategoryError('');
    setCreatingCategory(true);
    try {
      const nuevaCategoria = await categoriasService.create({ nombre });
      const categoriaId = nuevaCategoria.id || nuevaCategoria.categoria_id;
      setCategorias((prev) => [...prev, nuevaCategoria]);
      if (categoriaId) {
        setFormData((prev) => ({
          ...prev,
          category: String(categoriaId)
        }));
      }
      setNewCategoryName('');
      toast.success('Categoría creada exitosamente');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      toast.error('Error al crear la categoría');
      setNewCategoryError('No se pudo crear la categoría. Intenta nuevamente.');
    } finally {
      setCreatingCategory(false);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'productName':
        if (!value.trim()) error = 'El nombre es obligatorio';
        else if (value.length > 100) error = 'El nombre no puede exceder 100 caracteres';
        break;
      case 'artista':
        if (value.length > 100) error = 'El artista no puede exceder 100 caracteres';
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
        const productoData = {
          nombre: formData.productName,
          artista: formData.artista || null,
          precio: parseFloat(formData.price),
          categoria_id: parseInt(formData.category, 10),
          stock: parseInt(formData.stock, 10),
          descripcion: formData.description || null,
          imagen: formData.imageUrl || null,
          activo: true
        };
        
        await productosService.create(productoData);
        toast.success(`¡Producto "${formData.productName}" creado exitosamente!`);
        setFormData({
          productName: '',
          artista: '',
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
        console.error('Error al crear producto:', error);
        toast.error('Error al crear el producto');
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

            <div className={`form-group ${errors.artista ? 'error' : ''}`}>
              <label htmlFor="artista">Artista</label>
              <input
                type="text"
                id="artista"
                name="artista"
                value={formData.artista}
                onChange={handleChange}
                maxLength="100"
                placeholder="Nombre del artista (opcional)"
              />
              <span className="error-message">{errors.artista}</span>
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
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {Array.isArray(categorias) && categorias.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <span className="error-message">{errors.category}</span>
              <div className="new-category-inline">
                <input
                  type="text"
                  placeholder="Nueva categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-base btn-secondary"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                >
                  {creatingCategory ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus"></i>}
                  {creatingCategory ? 'Creando...' : 'Añadir'}
                </button>
              </div>
              {newCategoryError && (
                <span className="error-message">{newCategoryError}</span>
              )}
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