import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminLayout';

const Inventory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('inventario');

  //datos simulados de productos
  const products = [
    {
      id: 1,
      name: 'Led Zeppelin IV',
      artist: 'Led Zeppelin',
      year: '1971',
      category: 'rock',
      price: 25000,
      stock: 15,
      status: 'active',
      image: 'https://www.musicworld.cl/img/cms/cd%20vinilos/led%20zeppelin/d2IV.jpg'
    },
    {
      id: 2,
      name: 'Back To Black',
      artist: 'Amy Winehouse',
      year: '2006',
      category: 'pop',
      price: 30000,
      stock: 8,
      status: 'active',
      image: 'https://thesoundofvinyl.us/cdn/shop/products/Amy-Winehouse-Backl-To-Black-1LP-Vinyl.png?v=1661868011&width=1000'
    },
    {
      id: 3,
      name: 'Plastic Beach',
      artist: 'Gorillaz',
      year: '2010',
      category: 'pop',
      price: 28000,
      stock: 0,
      status: 'out-of-stock',
      image: 'https://cdn.webshopapp.com/shops/13847/files/405053016/gorillaz-plastic-beach-vinyl-2lp.jpg'
    },
    {
      id: 4,
      name: 'Dark Side of the Moon',
      artist: 'Pink Floyd',
      year: '1973',
      category: 'rock',
      price: 35000,
      stock: 22,
      status: 'active',
      image: 'https://www.musicworld.cl/img/cms/cd%20vinilos/pink%20floyd/dark%20side%20of%20the%20moon.jpg'
    },
    {
      id: 5,
      name: 'Abbey Road',
      artist: 'The Beatles',
      year: '1969',
      category: 'rock',
      price: 40000,
      stock: 12,
      status: 'active',
      image: 'https://www.musicworld.cl/img/cms/cd%20vinilos/the%20beatles/abbey%20road.jpg'
    }
  ];

  //filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  //productos críticos (stock bajo)
  const criticalProducts = products.filter(product => product.stock <= 10);

  const handleEditProduct = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      console.log('Eliminar producto:', id);
      //aquí iría la lógica para eliminar el producto
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

  const getCategoryBadge = (category) => {
    return <span className={`category-badge ${category}`}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>;
  };

  const handleGenerateReport = () => {
    console.log('Generar reporte de inventario');
    //aquí iría la lógica para generar reportes
  };

  const headerActions = (
    <div className="header-actions">
      <button 
        className="btn-base btn-secondary"
        onClick={handleGenerateReport}
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
            <button 
              className={`tab ${activeTab === 'criticos' ? 'active' : ''}`}
              onClick={() => setActiveTab('criticos')}
            >
              <i className="fas fa-exclamation-triangle"></i>
              Productos Críticos ({criticalProducts.length})
            </button>
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
              <option value="rock">Rock</option>
              <option value="jazz">Jazz</option>
              <option value="pop">Pop</option>
              <option value="classical">Clásica</option>
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
              {(activeTab === 'inventario' ? filteredProducts : criticalProducts).map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <div className="product-info">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div>
                        <p className="product-name">{product.name}</p>
                        <p className="product-year">{product.year}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.artist}</td>
                  <td>{getCategoryBadge(product.category)}</td>
                  <td>${product.price.toLocaleString()}</td>
                  <td>{product.stock}</td>
                  <td>{getStatusBadge(product.status)}</td>
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

export default Inventory;