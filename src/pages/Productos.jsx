import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";
import { useCart } from "../contexts/CartContext.jsx";
import { useToast } from "../contexts/ToastContext.jsx";

const CATS = ["Todos","Rock","Jazz","Pop","Clásica"];

export default function Productos(){
  const [cat,setCat] = useState("Todos");
  const { add } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const list = useMemo(() => {
    if (cat === "Todos") return PRODUCTS;
    const norm = cat.toLowerCase();
    return PRODUCTS.filter(p => (p.genero||"").toLowerCase() === norm);
  }, [cat]);

  const onAdd = (p) => {
    add({ id:p.id, name:p.nombre, price:p.precio, image:p.imagen, artist:p.artista, qty:1 });
    toast.success(`Se agregó "${p.nombre}" al carrito`);
  };

  return (
    <main>
      <section className="page-hero products-hero">
        <h1>Nuestra Colección de Vinilos</h1>
        <p>Descubre miles de títulos únicos y ediciones especiales</p>
      </section>

      <section className="section-base">
        <div className="container">
          <h3 style={{textAlign:"center"}}>Filtrar por:</h3>
          <div className="chips" style={{margin:".75rem 0 1.25rem"}}>
            {CATS.map(c => (
              <button
                key={c} className={`chip ${cat===c?"active":""}`}
                onClick={()=>setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {list.map((p) => (
              <article key={p.id} className="producto-card">
                <div className="img-wrap">
                  <img src={p.imagen} alt={p.nombre}/>
                  <div className="overlay">
                    <button
                      className="overlay-btn btn-base"
                      onClick={()=>navigate(`/producto/${p.id}`)}
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>

                <h3 style={{marginTop:".75rem"}}>{p.nombre}</h3>
                <p className="text-muted">{p.artista} · {p.genero} · {p.año}</p>
                <p className="price">${p.precio.toLocaleString()}</p>

                <div className="card-actions">
                  <button className="btn-base btn-primary" onClick={()=>onAdd(p)}>
                    Agregar al Carrito
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
