import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';
import { productosService, categoriasService } from '../../services/api.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    codigoProducto: '',
    productName: '',
    artist: '',
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryError, setNewCategoryError] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [producto, categoriasData] = await Promise.all([
          productosService.getById(id),
          categoriasService.getAll()
        ]);
        setCategorias(categoriasData);
        
        //obtener categoria_id: primero buscar por ID, luego por nombre de categoría
        let categoriaId = producto.categoria_id || (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.id) || null;
        
        //si no hay categoria_id pero hay categoria como string, buscar por nombre
        if (!categoriaId && producto.categoria && typeof producto.categoria === 'string') {
          const categoriaEncontrada = categoriasData.find((c) => 
            c.nombre && c.nombre.toLowerCase() === producto.categoria.toLowerCase()
          );
          if (categoriaEncontrada) {
            categoriaId = categoriaEncontrada.id;
          }
        }
        
        const categoryValue = categoriaId ? String(categoriaId) : '';
        
        setFormData({
          codigoProducto: `PROD-${producto.id}`,
          productName: producto.nombre,
          artist: producto.artista || '',
          description: producto.descripcion || '',
          price: producto.precio,
          stock: producto.stock,
          stockCritico: producto.stockCritico || 5,
          category: categoryValue,
          imageUrl: producto.imagen || '',
        });
      } catch (error) {
        console.error('Error al cargar producto:', error);
        toast.error('Error al cargar el producto');
        setMessage('Error al cargar el producto.');
        setMessageType('error');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

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
      case 'codigoProducto':
        if (!value.trim()) error = 'El código producto es obligatorio';
        else if (value.length < 3) error = 'El código producto debe tener al menos 3 caracteres';
        break;
      case 'productName':
        if (!value.trim()) error = 'El nombre es obligatorio';
        else if (value.length > 100) error = 'El nombre no puede exceder 100 caracteres';
        break;
      case 'artist':
        if (!value.trim()) error = 'El artista es obligatorio';
        else if (value.length > 100) error = 'El artista no puede exceder 100 caracteres';
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
          artista: formData.artist,
          precio: parseFloat(formData.price),
          categoria_id: parseInt(formData.category, 10),
          stock: parseInt(formData.stock, 10),
          descripcion: formData.description || '',
          imagen: formData.imageUrl || '',
          activo: true
        };
        
        await productosService.update(id, productoData);
        toast.success(`¡Producto "${formData.productName}" actualizado exitosamente!`);
        setMessage(`¡Producto "${formData.productName}" actualizado exitosamente!`);
        setMessageType('success');
        setTimeout(() => navigate('/admin/inventory'), 1500);
      } catch (error) {
        console.error('Error al actualizar producto:', error);
        toast.error('Error al actualizar el producto');
        setMessage('Error al actualizar el producto.');
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

  if (loading && initialLoad) {
    return (
      <AdminPageLayout title="Cargando Producto...">
        <div className="content-section text-center">
          <i className="fas fa-spinner fa-spin fa-3x"></i>
          <p className="mt-2">Cargando datos del producto...</p>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Editar Producto" headerActions={headerActions}>
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
                min="3"
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

            <div className={`form-group ${errors.artist ? 'error' : ''}`}>
              <label htmlFor="artist">Artista *</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                maxLength="100"
              />
              <span className="error-message">{errors.artist}</span>
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
              <label htmlFor="category">Categoría *</label>
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
};

export default EditProduct;