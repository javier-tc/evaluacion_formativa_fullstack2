import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";      
import { useCart } from "../contexts/CartContext.jsx"; 

export default function DetalleProducto() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => String(p.id) === String(id));
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <main className="section-base app-main">
        <div className="container"><h2>Producto no encontrado</h2></div>
      </main>
    );
  }

  const relacionados = PRODUCTS
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const handleAdd = () => {
    add({
      id: product.id,
      name: product.nombre,
      price: product.precio,
      image: product.imagen,
      artist: product.artista,
      qty,
    });
  };

  return (
    <main className="app-main">
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
                {product.artista} · {product.genero} · {product.año}
              </div>

              <div>
                <span className="price-big">${product.precio.toLocaleString()}</span>
                <span className="stock-hint">Stock: {product.stock ?? 8} unidades</span>
              </div>

              <h3 style={{marginTop:"1.25rem"}}>Descripción</h3>
              <p>
                {product.descripcion ??
                  "El segundo y último álbum de estudio de Amy Winehouse, ganador de múltiples premios Grammy."}
              </p>

              <h3 style={{marginTop:"1rem"}}>Especificaciones</h3>
              <div className="specs">
                <div className="row">
                  <span className="label">Categoría:</span>
                  <span>{product.genero?.toLowerCase() || "—"}</span>
                </div>
                <div className="row">
                  <span className="label">Stock Crítico:</span>
                  <span>{product.stockCritico ?? 3} unidades</span>
                </div>
                <div className="row">
                  <span className="label">Estado:</span>
                  <span>Disponible</span>
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
                  <p className="text-muted">{p.genero} · {p.año}</p>
                  <p className="price" style={{color:"#e74c3c", fontWeight:800}}>${p.precio.toLocaleString()}</p>

                  <button
                    className="btn-base btn-orange"
                    onClick={() => add({ id:p.id, name:p.nombre, price:p.precio, image:p.imagen, artist:p.artista })}
                  >
                    Agregar al Carrito
                  </button>
                </article>
              ))}
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}
