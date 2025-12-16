import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';
import { productosService, categoriasService } from '../../services/api.js';
import { useToast } from '../../contexts/ToastContext.jsx';

const Inventory = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('inventario');
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productosData, categoriasData] = await Promise.all([
          productosService.getAll(),
          categoriasService.getAll()
        ]);
        setProducts(Array.isArray(productosData) ? productosData : []);
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  const getCategoriaNombre = (product) => {
    if (!product || !Array.isArray(categorias) || categorias.length === 0) {
      return product?.categoria?.nombre || product?.category || '';
    }
    
    //primero intentar obtener categoria_id
    const categoriaId = product.categoria_id || (product.categoria && typeof product.categoria === 'object' && product.categoria.id) || null;
    
    if (categoriaId) {
      //normalizar comparación: convertir ambos a número y también comparar como string
      const categoriaIdNum = Number(categoriaId);
      const categoriaIdStr = String(categoriaId);
      
      const encontrada = categorias.find((c) => {
        const cIdNum = Number(c.id);
        const cIdStr = String(c.id);
        return cIdNum === categoriaIdNum || cIdStr === categoriaIdStr;
      });
      
      if (encontrada && encontrada.nombre) {
        return encontrada.nombre;
      }
    }
    
    //si no hay categoria_id, buscar por nombre de categoría (string)
    const categoriaNombre = product.categoria && typeof product.categoria === 'string' 
      ? product.categoria 
      : (product.categoria && typeof product.categoria === 'object' && product.categoria.nombre) 
        ? product.categoria.nombre 
        : product.category || '';
    
    if (categoriaNombre) {
      //buscar la categoría por nombre (case-insensitive)
      const encontradaPorNombre = categorias.find((c) => 
        c.nombre && c.nombre.toLowerCase() === categoriaNombre.toLowerCase()
      );
      
      if (encontradaPorNombre && encontradaPorNombre.nombre) {
        return encontradaPorNombre.nombre;
      }
      
      //si no se encuentra, devolver el nombre original
      return categoriaNombre;
    }
    
    return '';
  };

  const getStatusFromProduct = (product) => {
    if (product.status) {
      return product.status;
    }
    if (product.stock === 0) {
      return 'out-of-stock';
    }
    if (product.activo === false) {
      return 'inactive';
    }
    return 'active';
  };

  const filteredProducts = products.filter(product => {
    const nombre = (product.nombre || product.name || '').toLowerCase();
    const artista = (product.artista || product.artist || '').toLowerCase();
    const matchesSearch =
      nombre.includes(searchTerm.toLowerCase()) ||
      artista.includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || (() => {
      if (!filterCategory) return true;
      
      //obtener categoria_id del producto
      const categoriaId = product.categoria_id || (product.categoria && typeof product.categoria === 'object' && product.categoria.id) || null;
      
      //si hay categoria_id, comparar por ID
      if (categoriaId) {
        const categoriaIdNum = Number(categoriaId);
        const categoriaIdStr = String(categoriaId);
        const filterNum = Number(filterCategory);
        const filterStr = String(filterCategory);
        if (categoriaIdNum === filterNum || categoriaIdStr === filterStr) {
          return true;
        }
      }
      
      //si no hay categoria_id, buscar por nombre de categoría
      const categoriaNombre = product.categoria && typeof product.categoria === 'string' 
        ? product.categoria 
        : (product.categoria && typeof product.categoria === 'object' && product.categoria.nombre) 
          ? product.categoria.nombre 
          : '';
      
      if (categoriaNombre) {
        //buscar la categoría seleccionada en el filtro
        const categoriaFiltro = categorias.find((c) => String(c.id) === String(filterCategory));
        if (categoriaFiltro && categoriaFiltro.nombre) {
          return categoriaNombre.toLowerCase() === categoriaFiltro.nombre.toLowerCase();
        }
      }
      
      return false;
    })();
    
    const status = getStatusFromProduct(product);
    const matchesStatus =
      !filterStatus ||
      status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const criticalProducts = products.filter(product => (product.stock || 0) <= 10);

  const handleEditProduct = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productosService.delete(id);
        toast.success('Producto eliminado exitosamente');
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        toast.error('Error al eliminar producto');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">Activo</span>;
      case 'inactive':
        return <span className="status-badge inactive">Inactivo</span>;
      case 'out-of-stock':
        return <span className="status-badge out-of-stock">Sin Stock</span>;
      default:
        return <span className="status-badge active">Activo</span>;
    }
  };

  const getCategoryBadge = (product) => {
    const categoryName = getCategoriaNombre(product);
    if (!categoryName) {
      return <span className="category-badge sin-categoria">Sin categoría</span>;
    }
    const slug = String(categoryName).toLowerCase().replace(/\s+/g, '-');
    const label = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    return <span className={`category-badge ${slug}`}>{label}</span>;
  };

  const headerActions = (
    <div className="header-actions">
      <button
        className="btn-base btn-secondary"
        onClick={() => navigate('/admin/reportes')}
      >
        <i className="fas fa-chart-bar"></i>
        Reportes
      </button>
      <button
        className="btn-base btn-primary"
        onClick={() => navigate('/admin/products/new')}
      >
        <i className="fas fa-plus"></i>
        Nuevo Producto
      </button>
    </div>
  );

  return (
    <AdminPageLayout title="Gestión de Productos" headerActions={headerActions}>
      <div className="content-section">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'inventario' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventario')}
            >
              <i className="fas fa-warehouse"></i>
              Inventario Completo
            </button>
            {/* <button 
              className={`tab ${activeTab === 'criticos' ? 'active' : ''}`}
              onClick={() => setActiveTab('criticos')}
            >
              <i className="fas fa-exclamation-triangle"></i>
              Productos Críticos ({criticalProducts.length})
            </button> */}
          </div>
        </div>

        <div className="section-header">
          <h2>{activeTab === 'inventario' ? 'Inventario de Productos' : 'Productos Críticos'}</h2>
          <div className="search-filter">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {Array.isArray(categorias) && categorias.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="out-of-stock">Sin Stock</option>
            </select>
          </div>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Artista</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="8" className="text-center">
                    <i className="fas fa-spinner fa-spin"></i> Cargando productos...
                  </td>
                </tr>
              )}
              {!loading && (activeTab === 'inventario' ? filteredProducts : criticalProducts).length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No se encontraron productos
                  </td>
                </tr>
              )}
              {!loading && (activeTab === 'inventario' ? filteredProducts : criticalProducts).map(product => {
                const nombre = product.nombre || product.name;
                const artista = product.artista || product.artist;
                const year = product.año || product.year || '';
                const precio = product.precio || product.price || 0;
                const stock = product.stock || 0;
                const status = getStatusFromProduct(product);
                const imagen = product.imagen || product.image;
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <div className="product-info">
                        <div className="product-image">
                          {imagen && (
                            <img src={imagen} alt={nombre} />
                          )}
                        </div>
                        <div>
                          <p className="product-name">{nombre}</p>
                          {year && <p className="product-year">{year}</p>}
                        </div>
                      </div>
                    </td>
                    <td>{artista}</td>
                    <td>{getCategoryBadge(product)}</td>
                    <td>${Number(precio).toLocaleString()}</td>
                    <td>{stock}</td>
                    <td>{getStatusBadge(status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditProduct(product.id)}
                          title="Editar Producto"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Eliminar Producto"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

export default Inventory;