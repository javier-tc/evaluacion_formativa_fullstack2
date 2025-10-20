import React, { useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";
import { useCart } from "../contexts/CartContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";

const CATS = ["Todos","Rock","Jazz","Pop","Clásica"];

export default function Productos(){
  const [cat, setCat] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [añoMin, setAñoMin] = useState("");
  const [añoMax, setAñoMax] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("nombre");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  const { add } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const productosFiltrados = useMemo(() => {
    let productos = PRODUCTS;

    //filtro por categoría
    if (cat !== "Todos") {
      const categoriaNormalizada = cat.toLowerCase();
      productos = productos.filter(p => (p.genero || "").toLowerCase() === categoriaNormalizada);
    }

    //filtro por búsqueda
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase();
      productos = productos.filter(p => 
        p.nombre.toLowerCase().includes(terminoBusqueda) ||
        p.artista.toLowerCase().includes(terminoBusqueda) ||
        p.genero.toLowerCase().includes(terminoBusqueda)
      );
    }

    //filtro por precio
    if (precioMin) {
      productos = productos.filter(p => p.precio >= parseInt(precioMin));
    }
    if (precioMax) {
      productos = productos.filter(p => p.precio <= parseInt(precioMax));
    }

    //filtro por año
    if (añoMin) {
      productos = productos.filter(p => p.año >= parseInt(añoMin));
    }
    if (añoMax) {
      productos = productos.filter(p => p.año <= parseInt(añoMax));
    }

    //ordenar productos
    productos.sort((a, b) => {
      switch (ordenarPor) {
        case "precio-asc":
          return a.precio - b.precio;
        case "precio-desc":
          return b.precio - a.precio;
        case "año":
          return b.año - a.año;
        case "nombre":
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

    return productos;
  }, [cat, busqueda, precioMin, precioMax, añoMin, añoMax, ordenarPor]);

  const onAdd = (p) => {
    add({ 
      id: p.id, 
      nombre: p.nombre, 
      precio: p.precio, 
      imagen: p.imagen, 
      artista: p.artista, 
      qty: 1 
    });
    toast.success(`Se agregó "${p.nombre}" al carrito`);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setPrecioMin("");
    setPrecioMax("");
    setAñoMin("");
    setAñoMax("");
    setOrdenarPor("nombre");
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={12}>
          <div className="text-center mb-5">
            <h1 className="display-4">
              <i className="bi bi-vinyl me-2"></i>Nuestra Colección de Vinilos
            </h1>
            <p className="lead">Descubre miles de títulos únicos y ediciones especiales</p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Filtros y Búsqueda</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                >
                  <i className={`bi bi-chevron-${mostrarFiltros ? 'up' : 'down'} me-2`}></i>
                  {mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros Avanzados
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Búsqueda</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, artista o género..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
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
                </Col>
              </Row>

              <div className="mb-3">
                <Form.Label>Categorías</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {CATS.map(c => (
                    <Button
                      key={c}
                      variant={cat === c ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setCat(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>

              {mostrarFiltros && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio Mínimo</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="0"
                        value={precioMin}
                        onChange={(e) => setPrecioMin(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio Máximo</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="100000"
                        value={precioMax}
                        onChange={(e) => setPrecioMax(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Año Mínimo</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="1950"
                        value={añoMin}
                        onChange={(e) => setAñoMin(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Año Máximo</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="2025"
                        value={añoMax}
                        onChange={(e) => setAñoMax(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Badge bg="info" className="fs-6">
                    {productosFiltrados.length} productos encontrados
                  </Badge>
                </div>
                <Button variant="outline-secondary" onClick={limpiarFiltros}>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Limpiar Filtros
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {productosFiltrados.length === 0 ? (
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle fs-1 d-block mb-3"></i>
              <h4>No se encontraron productos</h4>
              <p>Intenta ajustar los filtros para ver más resultados.</p>
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          {productosFiltrados.map((p) => (
            <Col key={p.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={p.imagen} 
                    alt={p.nombre}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <Badge 
                    bg="secondary" 
                    className="position-absolute top-0 end-0 m-2"
                  >
                    {p.genero}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h6">{p.nombre}</Card.Title>
                  <Card.Text className="text-muted">
                    {p.artista} • {p.año}
                  </Card.Text>
                  <Card.Text className="fw-bold text-primary mb-3">
                    {formatearPrecio(p.precio)}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-grid gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate(`/producto/${p.id}`)}
                      >
                        <i className="bi bi-eye me-2"></i>
                        Ver Detalles
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => onAdd(p)}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Agregar al Carrito
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
