import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";
import { useCart } from "../contexts/CartContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { add } = useCart();
  const toast = useToast(); //dentro del componente
  const destacados = PRODUCTS.slice(0, 3);

  //función para agregar producto al carrito
  const handleAdd = (p) => {
    add({ 
      id: p.id, 
      nombre: p.nombre, 
      precio: p.precio, 
      imagen: p.imagen, 
      artista: p.artista 
    });
    toast.success(`Se agregó "${p.nombre}" al carrito`);
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
                {p.artista} · {p.genero} · {p.año}
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
      </section>
    </>
  );
}
