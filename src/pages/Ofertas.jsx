import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products.js';

const Ofertas = () => {
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('descuento');

  //simular productos en oferta (descuentos del 10% al 50%)
  const productosConOfertas = useMemo(() => {
    return PRODUCTS.map(producto => {
      const descuento = Math.floor(Math.random() * 41) + 10; //10% a 50%
      const precioOriginal = producto.precio;
      const precioDescuento = Math.round(precioOriginal * (1 - descuento / 100));
      
      return {
        ...producto,
        precioOriginal,
        precioDescuento,
        descuento,
        enOferta: true
      };
    });
  }, []);

  //filtrar productos según los filtros aplicados
  const productosFiltrados = useMemo(() => {
    let productos = productosConOfertas;

    //filtrar por precio
    if (filtroPrecio) {
      const [min, max] = filtroPrecio.split('-').map(Number);
      productos = productos.filter(p => p.precioDescuento >= min && p.precioDescuento <= max);
    }

    //filtrar por categoría
    if (filtroCategoria) {
      productos = productos.filter(p => p.categoria === filtroCategoria);
    }

    //ordenar productos
    productos.sort((a, b) => {
      switch (ordenarPor) {
        case 'precio-asc':
          return a.precioDescuento - b.precioDescuento;
        case 'precio-desc':
          return b.precioDescuento - a.precioDescuento;
        case 'descuento':
        default:
          return b.descuento - a.descuento;
      }
    });

    return productos;
  }, [productosConOfertas, filtroPrecio, filtroCategoria, ordenarPor]);

  //obtener categorías únicas
  const categorias = useMemo(() => {
    return [...new Set(PRODUCTS.map(p => p.categoria))];
  }, []);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const calcularAhorro = (precioOriginal, precioDescuento) => {
    return precioOriginal - precioDescuento;
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={12}>
          <div className="text-center mb-5">
            <h1 className="display-4 text-danger">
              <i className="bi bi-percent"></i> Ofertas Especiales
            </h1>
            <p className="lead">
              ¡Aprovecha estos increíbles descuentos en vinilos seleccionados!
            </p>
            <Badge bg="danger" className="fs-6">
              {productosFiltrados.length} productos en oferta
            </Badge>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Card className="mb-4">
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
                  <option value="0-15000">$0 - $15.000</option>
                  <option value="15000-25000">$15.000 - $25.000</option>
                  <option value="25000-35000">$25.000 - $35.000</option>
                  <option value="35000-999999">$35.000+</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select 
                  value={filtroCategoria} 
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Ordenar por</Form.Label>
                <Form.Select 
                  value={ordenarPor} 
                  onChange={(e) => setOrdenarPor(e.target.value)}
                >
                  <option value="descuento">Mayor Descuento</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="bg-danger text-white">
            <Card.Body className="text-center">
              <h5><i className="bi bi-lightning-fill me-2"></i>Oferta Relámpago</h5>
              <p className="mb-0">
                ¡Descuentos de hasta 50%!<br />
                <small>Por tiempo limitado</small>
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          {productosFiltrados.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <h4>No se encontraron ofertas</h4>
                <p className="text-muted">Intenta ajustar los filtros para ver más resultados.</p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {productosFiltrados.map(producto => (
                <Col key={producto.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm position-relative">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Badge 
                        bg="danger" 
                        className="position-absolute top-0 start-0 m-2 fs-6"
                      >
                        -{producto.descuento}%
                      </Badge>
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
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <span className="text-decoration-line-through text-muted small me-2">
                            {formatearPrecio(producto.precioOriginal)}
                          </span>
                          <span className="fw-bold text-danger fs-5">
                            {formatearPrecio(producto.precioDescuento)}
                          </span>
                        </div>
                        <small className="text-success">
                          <i className="bi bi-arrow-down"></i> Ahorras {formatearPrecio(calcularAhorro(producto.precioOriginal, producto.precioDescuento))}
                        </small>
                      </div>

                      <div className="mt-auto">
                        <Button 
                          as={Link} 
                          to={`/producto/${producto.id}`}
                          variant="danger" 
                          size="sm" 
                          className="w-100"
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Ver Oferta
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

      <Row className="mt-5">
        <Col lg={12}>
          <Card className="bg-light">
            <Card.Body className="text-center py-4">
              <h5><i className="bi bi-info-circle me-2"></i>Información Importante</h5>
              <Row>
                <Col md={4}>
                  <div className="mb-3">
                    <i className="bi bi-truck text-primary fs-3"></i>
                    <h6 className="mt-2">Envío Gratis</h6>
                    <small>En compras sobre $50.000</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <i className="bi bi-shield-check text-success fs-3"></i>
                    <h6 className="mt-2">Garantía</h6>
                    <small>30 días de garantía</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="mb-3">
                    <i className="bi bi-arrow-clockwise text-warning fs-3"></i>
                    <h6 className="mt-2">Devoluciones</h6>
                    <small>Fácil proceso de devolución</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ofertas;
