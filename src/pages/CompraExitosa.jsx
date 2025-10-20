import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const CompraExitosa = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orden = location.state?.orden;

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orden) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center py-5">
                <h4>No se encontró información de la orden</h4>
                <p className="text-muted">Parece que llegaste aquí por error.</p>
                <Button variant="primary" onClick={() => navigate('/')}>
                  Ir al Inicio
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-success">
            <Card.Header className="bg-success text-white text-center">
              <h3 className="mb-0">
                <i className="bi bi-check-circle-fill me-2"></i>
                ¡Compra Exitosa!
              </h3>
            </Card.Header>
            <Card.Body className="text-center py-4">
              <div className="mb-4">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              
              <h4 className="text-success mb-3">¡Gracias por tu compra!</h4>
              <p className="lead">
                Tu pedido ha sido procesado exitosamente y será enviado pronto.
              </p>

              <Card className="mt-4">
                <Card.Header>
                  <h5 className="mb-0">Detalles de la Orden</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Número de Orden:</strong> #{orden.id}</p>
                      <p><strong>Fecha:</strong> {formatearFecha(orden.fecha)}</p>
                      <p><strong>Total:</strong> {formatearPrecio(orden.total)}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellidos}</p>
                      <p><strong>Email:</strong> {orden.cliente.email}</p>
                      <p><strong>Teléfono:</strong> {orden.cliente.telefono || 'No especificado'}</p>
                    </Col>
                  </Row>
                  
                  <hr />
                  
                  <h6>Dirección de Envío:</h6>
                  <p className="mb-0">
                    {orden.cliente.calle}{orden.cliente.departamento ? ', ' + orden.cliente.departamento : ''}<br />
                    {orden.cliente.comuna}, {orden.cliente.region}
                    {orden.cliente.indicaciones && <><br /><small className="text-muted"><strong>Indicaciones:</strong> {orden.cliente.indicaciones}</small></>}
                  </p>
                </Card.Body>
              </Card>

              <Card className="mt-3">
                <Card.Header>
                  <h5 className="mb-0">Productos Comprados</h5>
                </Card.Header>
                <Card.Body>
                  {orden.items.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.imagen} 
                          alt={item.nombre}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="me-3 rounded"
                        />
                        <div>
                          <strong>{item.nombre}</strong>
                          <br />
                          <small className="text-muted">{item.artista}</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <Badge bg="secondary" className="me-2">x{item.qty}</Badge>
                        <strong>{formatearPrecio(item.precio * item.qty)}</strong>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>

              <div className="mt-4">
                <Alert variant="info" className="text-start">
                  <h6><i className="bi bi-info-circle me-2"></i>Próximos Pasos:</h6>
                  <ul className="mb-0">
                    <li>Recibirás un email de confirmación con los detalles de tu pedido</li>
                    <li>Te notificaremos cuando tu pedido sea enviado</li>
                    <li>El tiempo de entrega estimado es de 3-5 días hábiles</li>
                    <li>Puedes contactarnos si tienes alguna pregunta</li>
                  </ul>
                </Alert>
              </div>

              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  as={Link}
                  to="/productos"
                >
                  Seguir Comprando
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  as={Link}
                  to="/"
                >
                  Ir al Inicio
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompraExitosa;
