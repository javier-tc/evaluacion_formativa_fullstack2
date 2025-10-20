import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products.js';

const Categorias = () => {
  const { categoria } = useParams();
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroAño, setFiltroAño] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('nombre');

  //obtener todas las categorías únicas
  const categorias = useMemo(() => {
    const cats = [...new Set(PRODUCTS.map(p => p.categoria))];
    return cats.map(cat => ({
      nombre: cat,
      cantidad: PRODUCTS.filter(p => p.categoria === cat).length
    }));
  }, []);

  //filtrar productos según la categoría seleccionada
  const productosFiltrados = useMemo(() => {
    let productos = categoria 
      ? PRODUCTS.filter(p => p.categoria === categoria)
      : PRODUCTS;

    //aplicar filtros adicionales
    if (filtroPrecio) {
      const [min, max] = filtroPrecio.split('-').map(Number);
      productos = productos.filter(p => p.precio >= min && p.precio <= max);
    }

    if (filtroAño) {
      productos = productos.filter(p => p.año >= parseInt(filtroAño));
    }

    //ordenar productos
    productos.sort((a, b) => {
      switch (ordenarPor) {
        case 'precio-asc':
          return a.precio - b.precio;
        case 'precio-desc':
          return b.precio - a.precio;
        case 'año':
          return b.año - a.año;
        case 'nombre':
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

    return productos;
  }, [categoria, filtroPrecio, filtroAño, ordenarPor]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

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
                {categorias.map(cat => (
                  <Link
                    key={cat.nombre}
                    to={`/categorias/${cat.nombre}`}
                    className={`btn ${categoria === cat.nombre ? 'btn-primary' : 'btn-outline-primary'}`}
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
                      <Badge 
                        bg="success" 
                        className="position-absolute top-0 end-0 m-2"
                      >
                        {producto.categoria}
                      </Badge>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6">{producto.nombre}</Card.Title>
                      <Card.Text className="text-muted small">
                        {producto.artista} • {producto.año}
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
