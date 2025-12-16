import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productosService, categoriasService } from "../services/api.js";      
import { useCart } from "../contexts/CartContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { Spinner } from "react-bootstrap";

export default function DetalleProducto() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const [productData, categoriasData] = await Promise.all([
          productosService.getById(id),
          categoriasService.getAll()
        ]);
        setProduct(productData);
        setCategorias(categoriasData);
        
        //cargar productos relacionados de la misma categoría
        if (productData.categoria_id) {
          const relacionadosData = await productosService.getByCategoria(productData.categoria_id);
          setRelacionados(relacionadosData.filter(p => p.id !== productData.id).slice(0, 3));
        }
      } catch (error) {
        console.error('Error al cargar producto:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const getCategoriaNombre = (producto) => {
    if (!producto || !Array.isArray(categorias) || categorias.length === 0) {
      return producto?.categoria?.nombre || (producto?.categoria && typeof producto.categoria === 'string' ? producto.categoria : '') || producto?.genero || '';
    }
    
    //si categoria es un objeto con nombre
    if (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.nombre) {
      return producto.categoria.nombre;
    }
    
    //primero intentar obtener categoria_id
    const categoriaId = producto.categoria_id || (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.id) || null;
    
    if (categoriaId) {
      const categoriaIdNum = Number(categoriaId);
      const encontrada = categorias.find((c) => Number(c.id) === categoriaIdNum);
      if (encontrada && encontrada.nombre) {
        return encontrada.nombre;
      }
    }
    
    //si no hay categoria_id, buscar por nombre de categoría (string)
    const categoriaNombre = producto.categoria && typeof producto.categoria === 'string' 
      ? producto.categoria 
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
    
    return producto.genero || '';
  };

  if (loading) {
    return (
      <div className="section-base">
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando producto...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-base">
        <div className="container"><h2>Producto no encontrado</h2></div>
      </div>
    );
  }

  const handleAdd = async () => {
    try {
      await add({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen,
        artista: product.artista,
        qty,
      });
      toast.success(`Se agregó "${product.nombre}" al carrito`);
    } catch (error) {
      toast.error('Error al agregar producto al carrito');
    }
  };

  return (
    <>
      <section className="section-base">
        <div className="container">

          {/* Grid  */}
          <div className="detail-grid">
            <div className="card padded-lg">
              <img src={product.imagen} alt={product.nombre} style={{width:"100%", borderRadius:12}} />
            </div>

            {/* Card info */}
            <div className="card padded-lg">
              <h1 className="detail-title">{product.nombre}</h1>
              <div className="detail-meta">
                {product.artista} {getCategoriaNombre(product) && `· ${getCategoriaNombre(product)}`} {product.año && `· ${product.año}`}
              </div>

              <div>
                <span className="price-big">${product.precio.toLocaleString()}</span>
                <span className="stock-hint">Stock: {product.stock ?? 8} unidades</span>
              </div>

              <h3 style={{marginTop:"1.25rem"}}>Descripción</h3>
              <p>
                {(product.descripcion && product.descripcion.trim()) || (product.description && product.description.trim()) || "No hay descripción disponible para este producto."}
              </p>

              <h3 style={{marginTop:"1rem"}}>Especificaciones</h3>
              <div className="specs">
                <div className="row">
                  <span className="label">Categoría:</span>
                  <span>{getCategoriaNombre(product) || "—"}</span>
                </div>
                <div className="row">
                  <span className="label">Stock:</span>
                  <span>{product.stock ?? 8} unidades</span>
                </div>
                <div className="row">
                  <span className="label">Estado:</span>
                  <span>{product.activo ? 'Disponible' : 'No disponible'}</span>
                </div>
              </div>

              <div className="actions-row">
                <div>
                  <label style={{marginRight:6}}>Cantidad:</label>
                  <select
                    className="qty-select"
                    value={qty}
                    onChange={(e)=>setQty(Number(e.target.value))}
                  >
                    {[1,2,3,4,5].map(n=>(<option key={n} value={n}>{n}</option>))}
                  </select>
                </div>

                <button className="btn-base btn-orange" onClick={handleAdd}>
                  Agregar al Carrito
                </button>

                <button className="btn-base btn-danger" onClick={handleAdd}>
                  Comprar Ahora
                </button>
              </div>
            </div>
          </div>

          {/* Relacionados */}
          <section className="section-base">
            <h2 className="text-center">Productos Relacionados</h2>
            <div className="related-grid">
              {relacionados.map((p) => (
                <article key={p.id} className="card padded related-card">
                  <div className="img">
                    <img src={p.imagen} alt={p.nombre} />
                  </div>
                  <h3 style={{marginTop:"1rem"}}>{p.nombre}</h3>
                  <p className="text-muted">{p.artista}</p>
                  <p className="text-muted">{getCategoriaNombre(p)} {p.año && `· ${p.año}`}</p>
                  <p className="price" style={{color:"#e74c3c", fontWeight:800}}>${p.precio.toLocaleString()}</p>

                  <button
                    className="btn-base btn-orange"
                    onClick={async () => {
                      try {
                        await add({ id:p.id, nombre:p.nombre, precio:p.precio, imagen:p.imagen, artista:p.artista });
                        toast.success(`Se agregó "${p.nombre}" al carrito`);
                      } catch (error) {
                        toast.error('Error al agregar producto al carrito');
                      }
                    }}
                  >
                    Agregar al Carrito
                  </button>
                </article>
              ))}
            </div>
          </section>

        </div>
      </section>
    </>
  );
}
