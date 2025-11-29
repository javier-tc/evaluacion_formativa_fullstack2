import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productosService, categoriasService } from "../services/api.js";
import { useCart } from "../contexts/CartContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { Spinner } from "react-bootstrap";

export default function Home() {
  const navigate = useNavigate();
  const { add } = useCart();
  const toast = useToast();
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestacados = async () => {
      try {
        const [productos, categoriasData] = await Promise.all([
          productosService.getAll(true),
          categoriasService.getAll()
        ]);
        setDestacados(productos.slice(0, 3));
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al cargar productos destacados:', error);
        toast.error('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };
    loadDestacados();
  }, [toast]);

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

  //función para agregar producto al carrito
  const handleAdd = async (p) => {
    try {
      await add({ 
        id: p.id, 
        nombre: p.nombre, 
        precio: p.precio, 
        imagen: p.imagen, 
        artista: p.artista 
      });
      toast.success(`Se agregó "${p.nombre}" al carrito`);
    } catch (error) {
      toast.error('Error al agregar producto al carrito');
    }
  };

  return (
    <>
      <section className="section-hero">
        <div className="hero-content">
          <h2>Descubre la Magia del Vinilo</h2>
          <p>La mejor colección de vinilos clásicos y contemporáneos</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
            <Link className="btn-base btn-primary btn-large" to="/registro">Únete Ahora</Link>
            <Link className="btn-base btn-secondary btn-large" to="/productos">Ver Productos</Link>
          </div>
        </div>
      </section>

      <section className="section-base">
        <h3 className="text-center">Productos Destacados</h3>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando productos...</span>
            </Spinner>
          </div>
        ) : (
          <div className="container grid-3">
            {destacados.map((p) => (
            <article key={p.id} className="producto-card">
              {/* Imagen con overlay */}
              <div className="img-wrap">
                <img src={p.imagen} alt={p.nombre} />
                <div className="overlay">
                  <button
                    type="button"
                    className="overlay-btn btn-base"
                    onClick={() => navigate(`/producto/${p.id}`)}
                  >
                    Ver Detalle
                  </button>
                </div>
              </div>

              <h3>{p.nombre}</h3>
              <p className="text-muted">
                {p.artista} {getCategoriaNombre(p) && `· ${getCategoriaNombre(p)}`} {p.año && `· ${p.año}`}
              </p>
              <p className="price">${p.precio.toLocaleString()}</p>

              <div className="card-actions">
                <button
                  className="btn-base btn-primary"
                  onClick={() => handleAdd(p)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
