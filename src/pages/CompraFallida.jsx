import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const CompraFallida = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const error = location.state?.error || 'Error desconocido en el procesamiento del pago';
  const datosCliente = location.state?.datosCliente;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-danger">
            <Card.Header className="bg-danger text-white text-center">
              <h3 className="mb-0">
                <i className="bi bi-x-circle-fill me-2"></i>
                Error en el Pago
              </h3>
            </Card.Header>
            <Card.Body className="text-center py-4">
              <div className="mb-4">
                <i className="bi bi-x-circle text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              
              <h4 className="text-danger mb-3">¡Ups! Algo salió mal</h4>
              <p className="lead">
                No pudimos procesar tu pago en este momento.
              </p>

              <Alert variant="danger" className="text-start">
                <h6><i className="bi bi-exclamation-triangle me-2"></i>Error:</h6>
                <p className="mb-0">{error}</p>
              </Alert>

              <Card className="mt-4">
                <Card.Header>
                  <h5 className="mb-0">¿Qué puedes hacer?</h5>
                </Card.Header>
                <Card.Body className="text-start">
                  <ul className="mb-0">
                    <li><strong>Verifica tus datos:</strong> Asegúrate de que la información de pago sea correcta</li>
                    <li><strong>Intenta nuevamente:</strong> Los errores temporales suelen resolverse en un segundo intento</li>
                    <li><strong>Usa otro método de pago:</strong> Prueba con una tarjeta diferente o transferencia bancaria</li>
                    <li><strong>Contacta soporte:</strong> Si el problema persiste, nuestro equipo te ayudará</li>
                  </ul>
                </Card.Body>
              </Card>

              {datosCliente && (
                <Card className="mt-3">
                  <Card.Header>
                    <h5 className="mb-0">Información Guardada</h5>
                  </Card.Header>
                  <Card.Body className="text-start">
                    <p className="mb-2">
                      <strong>Buenas noticias:</strong> Hemos guardado tu información de envío y productos seleccionados.
                    </p>
                    <p className="mb-0">
                      Puedes volver al checkout para intentar el pago nuevamente sin perder tus datos.
                    </p>
                  </Card.Body>
                </Card>
              )}

              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <Button 
                  variant="danger" 
                  size="lg"
                  onClick={() => navigate('/carrito')}
                >
                  Volver al Carrito
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  as={Link}
                  to="/contacto"
                >
                  Contactar Soporte
                </Button>
                <Button 
                  variant="outline-secondary" 
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

export default CompraFallida;
