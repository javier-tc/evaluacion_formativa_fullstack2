import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { REGIONES_COMUNAS } from '../data/users.js';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clear } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellidos: user?.apellidos || '',
        email: user?.email || '',
        calle: user?.direccion?.calle || '',
        departamento: user?.direccion?.departamento || '',
        region: user?.direccion?.region || '',
        comuna: user?.direccion?.comuna || '',
        indicaciones: user?.direccion?.indicaciones || ''
    });

    const [errores, setErrores] = useState({});
    const [procesando, setProcesando] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        //limpiar error del campo cuando el usuario empiece a escribir
        if (errores[name]) {
            setErrores(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido';
        if (!formData.apellidos.trim()) nuevosErrores.apellidos = 'Los apellidos son requeridos';
        if (!formData.email.trim()) nuevosErrores.email = 'El email es requerido';
        if (!formData.calle.trim()) nuevosErrores.calle = 'La calle es requerida';
        if (!formData.region.trim()) nuevosErrores.region = 'La región es requerida';
        if (!formData.comuna.trim()) nuevosErrores.comuna = 'La comuna es requerida';

        //validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            nuevosErrores.email = 'El formato del email no es válido';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const simularError = (mensajeError) => {
        navigate('/compra-fallida', {
            state: {
                error: mensajeError,
                datosCliente: formData
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            showToast('Por favor corrige los errores en el formulario', 'error');
            return;
        }

        setProcesando(true);

        //simular procesamiento de pago
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            //simular diferentes tipos de errores basados en condiciones específicas
            const numeroAleatorio = Math.random();
            let errorMessage = '';
            let pagoExitoso = true;

            //condiciones específicas para fallos (30% de probabilidad total)
            if (numeroAleatorio < 0.1) {
                //10%
                pagoExitoso = false;
                errorMessage = 'Fondos insuficientes en tu cuenta. Por favor verifica tu saldo.';
            }

            if (pagoExitoso) {
                clear(); //limpiar carrito
                navigate('/compra-exitosa', {
                    state: {
                        orden: {
                            id: Date.now(),
                            fecha: new Date().toISOString(),
                            items: items,
                            total: totalPrice,
                            cliente: formData
                        }
                    }
                });
            } else {
                navigate('/compra-fallida', {
                    state: {
                        error: errorMessage,
                        datosCliente: formData
                    }
                });
            }
        } catch (error) {
            navigate('/compra-fallida', {
                state: {
                    error: 'Error inesperado del servidor. Por favor contacta al soporte técnico.',
                    datosCliente: formData
                }
            });
        } finally {
            setProcesando(false);
        }
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(precio);
    };

    if (items.length === 0) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Body className="text-center py-5">
                                <h4>Tu carrito está vacío</h4>
                                <p className="text-muted">Agrega algunos productos antes de proceder al checkout.</p>
                                <Button variant="primary" onClick={() => navigate('/productos')}>
                                    Ver Productos
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
            <Row>
                <Col lg={8}>
                    <Card>
                        <Card.Header>
                            <h4 className="mb-0">Información de Envío</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                {/*información del cliente*/}
                                <h5 className="mb-3">Información del Cliente</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                isInvalid={!!errores.nombre}
                                                placeholder="Tu nombre"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errores.nombre}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Apellidos *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="apellidos"
                                                value={formData.apellidos}
                                                onChange={handleInputChange}
                                                isInvalid={!!errores.apellidos}
                                                placeholder="Tus apellidos"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errores.apellidos}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Correo Electrónico *</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                isInvalid={!!errores.email}
                                                placeholder="tu@email.com"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errores.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr />

                                {/*dirección de entrega*/}
                                <h5 className="mb-3">Dirección de Entrega</h5>
                                <Row>
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Calle *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="calle"
                                                value={formData.calle}
                                                onChange={handleInputChange}
                                                isInvalid={!!errores.calle}
                                                placeholder="Calle, número"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errores.calle}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Departamento (Opcional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="departamento"
                                                value={formData.departamento}
                                                onChange={handleInputChange}
                                                placeholder="Depto, casa, etc."
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Región *</Form.Label>
                                            <Form.Select
                                                name="region"
                                                value={formData.region}
                                                onChange={handleInputChange}
                                                isInvalid={!!errores.region}
                                            >
                                                <option value="">Selecciona una región</option>
                                                {Object.keys(REGIONES_COMUNAS).map(region => (
                                                    <option key={region} value={region}>{region}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errores.region}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Comuna *</Form.Label>
                                            <Form.Select
                                                name="comuna"
                                                value={formData.comuna}
                                                onChange={handleInputChange}
                                                isInvalid={!!errores.comuna}
                                                disabled={!formData.region}
                                            >
                                                <option value="">Selecciona una comuna</option>
                                                {formData.region && REGIONES_COMUNAS[formData.region]?.map(comuna => (
                                                    <option key={comuna} value={comuna}>{comuna}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errores.comuna}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Indicaciones para la Entrega (Opcional)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="indicaciones"
                                                value={formData.indicaciones}
                                                onChange={handleInputChange}
                                                placeholder="Instrucciones especiales para el repartidor..."
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Alert variant="info" className="mt-4">
                                    <i className="bi bi-info-circle me-2"></i>
                                    <strong>Información importante:</strong><br />
                                    • El envío es gratuito para todas las compras<br />
                                    • El tiempo de entrega es de 3-5 días hábiles<br />
                                    • Te contactaremos por email para coordinar la entrega
                                </Alert>

                                <div className="d-grid">
                                    <Button
                                        type="submit"
                                        variant="success"
                                        size="lg"
                                        disabled={procesando}
                                    >
                                        {procesando ? 'Procesando...' : `Confirmar Pedido - ${formatearPrecio(totalPrice)}`}
                                    </Button>

                                    {/*botones de prueba para simular errores - solo visibles en desarrollo*/}
                                    {/* {process.env.NODE_ENV === 'development' && (
                    <div className="mt-3">
                      <small className="text-muted d-block mb-2">🧪 Botones de Prueba (Solo Desarrollo):</small>
                      <div className="d-grid gap-1">
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => simularError('Tu tarjeta ha expirado. Por favor usa una tarjeta válida.')}
                          disabled={procesando}
                        >
                          Simular Error: Tarjeta Expirada
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => simularError('Fondos insuficientes en tu cuenta. Por favor verifica tu saldo.')}
                          disabled={procesando}
                        >
                          Simular Error: Fondos Insuficientes
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => simularError('Error de conexión con el banco. Por favor intenta nuevamente.')}
                          disabled={procesando}
                        >
                          Simular Error: Conexión
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => simularError('Tu tarjeta ha sido bloqueada por seguridad. Contacta a tu banco.')}
                          disabled={procesando}
                        >
                          Simular Error: Tarjeta Bloqueada
                        </Button>
                      </div>
                    </div>
                  )} */}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Resumen del Pedido</h5>
                        </Card.Header>
                        <Card.Body>
                            {items.map(item => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <small className="fw-bold">{item.nombre}</small>
                                        <br />
                                        <small className="text-muted">Cantidad: {item.qty}</small>
                                    </div>
                                    <small>{formatearPrecio(item.precio * item.qty)}</small>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span>Subtotal:</span>
                                <span>{formatearPrecio(totalPrice)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span>Envío:</span>
                                <span className="text-success">Gratis</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center">
                                <strong>Total:</strong>
                                <strong className="text-primary">{formatearPrecio(totalPrice)}</strong>
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
        </Container>
    );
};

export default Checkout;