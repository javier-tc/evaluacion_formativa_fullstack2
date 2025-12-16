import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { productosService, categoriasService } from '../services/api.js';
import { useToast } from '../contexts/ToastContext.jsx';

const Categorias = () => {
  const { categoria } = useParams();
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroAño, setFiltroAño] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('nombre');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productosData, categoriasData] = await Promise.all([
          productosService.getAll(true), //solo productos activos
          categoriasService.getAll()
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar productos y categorías');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  //obtener categorías con cantidad de productos
  const categoriasConCantidad = useMemo(() => {
    if (!Array.isArray(categorias) || !Array.isArray(productos)) {
      return [];
    }

    const getCategoriaNombre = (producto) => {
      if (!producto || !Array.isArray(categorias) || categorias.length === 0) {
        return producto?.categoria?.nombre || (producto?.categoria && typeof producto.categoria === 'string' ? producto.categoria : '') || '';
      }
      
      const categoriaId = producto.categoria_id || (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.id) || null;
      
      if (categoriaId) {
        const categoriaIdNum = Number(categoriaId);
        const encontrada = categorias.find((c) => Number(c.id) === categoriaIdNum);
        if (encontrada && encontrada.nombre) {
          return encontrada.nombre;
        }
      }
      
      const categoriaNombre = producto.categoria && typeof producto.categoria === 'string' 
        ? producto.categoria 
        : (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.nombre) 
          ? producto.categoria.nombre 
          : '';
      
      if (categoriaNombre) {
        const encontradaPorNombre = categorias.find((c) => 
          c.nombre && c.nombre.toLowerCase() === categoriaNombre.toLowerCase()
        );
        
        if (encontradaPorNombre && encontradaPorNombre.nombre) {
          return encontradaPorNombre.nombre;
        }
        
        return categoriaNombre;
      }
      
      return '';
    };

    return categorias.map(cat => {
      const cantidad = productos.filter(p => {
        const catNombre = getCategoriaNombre(p);
        return catNombre && catNombre.toLowerCase() === cat.nombre.toLowerCase();
      }).length;
      
      return {
        id: cat.id,
        nombre: cat.nombre,
        cantidad: cantidad
      };
    });
  }, [categorias, productos]);

  //filtrar productos según la categoría seleccionada
  const productosFiltrados = useMemo(() => {
    if (!Array.isArray(productos) || productos.length === 0) {
      return [];
    }

    const getCategoriaNombre = (producto) => {
      if (!producto || !Array.isArray(categorias) || categorias.length === 0) {
        return producto?.categoria?.nombre || (producto?.categoria && typeof producto.categoria === 'string' ? producto.categoria : '') || '';
      }
      
      const categoriaId = producto.categoria_id || (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.id) || null;
      
      if (categoriaId) {
        const categoriaIdNum = Number(categoriaId);
        const encontrada = categorias.find((c) => Number(c.id) === categoriaIdNum);
        if (encontrada && encontrada.nombre) {
          return encontrada.nombre;
        }
      }
      
      const categoriaNombre = producto.categoria && typeof producto.categoria === 'string' 
        ? producto.categoria 
        : (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.nombre) 
          ? producto.categoria.nombre 
          : '';
      
      if (categoriaNombre) {
        const encontradaPorNombre = categorias.find((c) => 
          c.nombre && c.nombre.toLowerCase() === categoriaNombre.toLowerCase()
        );
        
        if (encontradaPorNombre && encontradaPorNombre.nombre) {
          return encontradaPorNombre.nombre;
        }
        
        return categoriaNombre;
      }
      
      return '';
    };

    let productosFiltrados = categoria 
      ? productos.filter(p => {
          const catNombre = getCategoriaNombre(p);
          return catNombre && catNombre.toLowerCase() === categoria.toLowerCase();
        })
      : productos;

    //aplicar filtros adicionales
    if (filtroPrecio) {
      const [min, max] = filtroPrecio.split('-').map(Number);
      productosFiltrados = productosFiltrados.filter(p => {
        const precio = Number(p.precio) || 0;
        return precio >= min && precio <= max;
      });
    }

    if (filtroAño) {
      productosFiltrados = productosFiltrados.filter(p => {
        const año = p.año || 0;
        return año >= parseInt(filtroAño);
      });
    }

    //ordenar productos
    productosFiltrados.sort((a, b) => {
      switch (ordenarPor) {
        case 'precio-asc':
          return (Number(a.precio) || 0) - (Number(b.precio) || 0);
        case 'precio-desc':
          return (Number(b.precio) || 0) - (Number(a.precio) || 0);
        case 'año':
          return (b.año || 0) - (a.año || 0);
        case 'nombre':
        default:
          return (a.nombre || '').localeCompare(b.nombre || '');
      }
    });

    return productosFiltrados;
  }, [categoria, filtroPrecio, filtroAño, ordenarPor, productos, categorias]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(Number(precio) || 0);
  };

  const getCategoriaNombre = (producto) => {
    if (!producto || !Array.isArray(categorias) || categorias.length === 0) {
      return producto?.categoria?.nombre || (producto?.categoria && typeof producto.categoria === 'string' ? producto.categoria : '') || '';
    }
    
    const categoriaId = producto.categoria_id || (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.id) || null;
    
    if (categoriaId) {
      const categoriaIdNum = Number(categoriaId);
      const encontrada = categorias.find((c) => Number(c.id) === categoriaIdNum);
      if (encontrada && encontrada.nombre) {
        return encontrada.nombre;
      }
    }
    
    const categoriaNombre = producto.categoria && typeof producto.categoria === 'string' 
      ? producto.categoria 
      : (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.nombre) 
        ? producto.categoria.nombre 
        : '';
    
    if (categoriaNombre) {
      const encontradaPorNombre = categorias.find((c) => 
        c.nombre && c.nombre.toLowerCase() === categoriaNombre.toLowerCase()
      );
      
      if (encontradaPorNombre && encontradaPorNombre.nombre) {
        return encontradaPorNombre.nombre;
      }
      
      return categoriaNombre;
    }
    
    return '';
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando productos...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={3}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Categorías</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link 
                  to="/categorias" 
                  className={`btn ${!categoria ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  Todas las categorías
                </Link>
                {categoriasConCantidad.map(cat => (
                  <Link
                    key={cat.id || cat.nombre}
                    to={`/categorias/${cat.nombre.toLowerCase()}`}
                    className={`btn ${categoria && categoria.toLowerCase() === cat.nombre.toLowerCase() ? 'btn-primary' : 'btn-outline-primary'}`}
                  >
                    {cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1)}
                    <Badge bg="secondary" className="ms-2">{cat.cantidad}</Badge>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Filtros</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Rango de Precio</Form.Label>
                <Form.Select 
                  value={filtroPrecio} 
                  onChange={(e) => setFiltroPrecio(e.target.value)}
                >
                  <option value="">Todos los precios</option>
                  <option value="0-20000">$0 - $20.000</option>
                  <option value="20000-30000">$20.000 - $30.000</option>
                  <option value="30000-40000">$30.000 - $40.000</option>
                  <option value="40000-999999">$40.000+</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Año mínimo</Form.Label>
                <Form.Select 
                  value={filtroAño} 
                  onChange={(e) => setFiltroAño(e.target.value)}
                >
                  <option value="">Todos los años</option>
                  <option value="2020">2020+</option>
                  <option value="2010">2010+</option>
                  <option value="2000">2000+</option>
                  <option value="1990">1990+</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Ordenar por</Form.Label>
                <Form.Select 
                  value={ordenarPor} 
                  onChange={(e) => setOrdenarPor(e.target.value)}
                >
                  <option value="nombre">Nombre A-Z</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                  <option value="año">Año: Más reciente</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              {categoria 
                ? `${categoria.charAt(0).toUpperCase() + categoria.slice(1)} (${productosFiltrados.length})`
                : `Todas las categorías (${productosFiltrados.length})`
              }
            </h2>
          </div>

          {productosFiltrados.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <h4>No se encontraron productos</h4>
                <p className="text-muted">Intenta ajustar los filtros para ver más resultados.</p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {productosFiltrados.map(producto => (
                <Col key={producto.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      {getCategoriaNombre(producto) && (
                        <Badge 
                          bg="success" 
                          className="position-absolute top-0 end-0 m-2"
                        >
                          {getCategoriaNombre(producto)}
                        </Badge>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6">{producto.nombre}</Card.Title>
                      <Card.Text className="text-muted small">
                        {producto.artista} {producto.año && `• ${producto.año}`}
                      </Card.Text>
                      <Card.Text className="fw-bold text-primary mb-3">
                        {formatearPrecio(producto.precio)}
                      </Card.Text>
                      <div className="mt-auto">
                        <Button 
                          as={Link} 
                          to={`/producto/${producto.id}`}
                          variant="outline-primary" 
                          size="sm" 
                          className="w-100"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Categorias;
