import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';

export default function Carrito() {
  const { items, totalPrice, remove, clear, add } = useCart();
  const navigate = useNavigate();

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const handleProcederPago = () => {
    navigate('/checkout');
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={12}>
          <h2 className="text-center mb-4">
            <i className="bi bi-cart3 me-2"></i>Mi Carrito
          </h2>
        </Col>
      </Row>

      {items.length === 0 ? (
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center py-5">
                <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
                <h4 className="mt-3">Tu carrito está vacío</h4>
                <p className="text-muted">Agrega algunos productos para comenzar tu compra.</p>
                <Button variant="primary" as={Link} to="/productos">
                  Ver Productos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Productos en tu carrito</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.imagen} 
                              alt={item.nombre}
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              className="me-3 rounded"
                            />
                            <div>
                              <strong>{item.nombre}</strong>
                              <br />
                              <small className="text-muted">{item.artista}</small>
                            </div>
                          </div>
                        </td>
                        <td>{formatearPrecio(item.precio)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={async () => {
                                if (item.qty > 1) {
                                  try {
                                    await remove(item.id);
                                    await add({...item, qty: item.qty - 1});
                                  } catch (error) {
                                    console.error('Error al actualizar cantidad:', error);
                                  }
                                }
                              }}
                              disabled={item.qty <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-2">{item.qty}</span>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={async () => {
                                try {
                                  await add(item);
                                } catch (error) {
                                  console.error('Error al actualizar cantidad:', error);
                                }
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td>{formatearPrecio(item.precio * item.qty)}</td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={async () => {
                              try {
                                await remove(item.id);
                              } catch (error) {
                                console.error('Error al remover item:', error);
                              }
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Resumen del Pedido</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Productos ({items.length})</span>
                  <span>{formatearPrecio(totalPrice)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span className="text-success">Gratis</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong className="text-primary">{formatearPrecio(totalPrice)}</strong>
                </div>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={handleProcederPago}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Proceder al Pago
                  </Button>
                  <Button 
                    variant="outline-secondary"
                    onClick={async () => {
                      try {
                        await clear();
                      } catch (error) {
                        console.error('Error al vaciar carrito:', error);
                      }
                    }}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Vaciar Carrito
                  </Button>
                  <Button 
                    variant="outline-primary"
                    as={Link}
                    to="/productos"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Seguir Comprando
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="mt-3">
              <Card.Body className="text-center">
                <h6><i className="bi bi-shield-check text-success me-2"></i>Compra Segura</h6>
                <small className="text-muted">
                  Tus datos están protegidos con encriptación SSL
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
