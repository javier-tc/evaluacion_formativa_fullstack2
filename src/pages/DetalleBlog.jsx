import React from "react";
import { useParams, Link } from "react-router-dom";
import { BLOGS } from "../data/blogs.js";

export default function DetalleBlog() {
  const { id } = useParams();
  const b = BLOGS.find((x) => String(x.id) === String(id));
  const otros = BLOGS.filter((x) => String(x.id) !== String(id)).slice(0, 3);

  if (!b) return (
    <main className="section-base app-main">
      <h2>Publicación no encontrada</h2>
    </main>
  );

  return (
    <main className="app-main">
      <section className="section-base">
        <div className="container">
          <div className="blog-hero">
            <img src={b.imagen} alt={b.titulo} />
            <div>
              <h1>{b.titulo}</h1>
              <div className="text-muted">
                {new Date(b.fecha).toLocaleDateString()} · {b.autor}
              </div>
              <span className="blog-chip">{b.categoria}</span>
            </div>
          </div>

          <article className="blog-detail">
            <div className="body">
              <p>{b.contenido}</p>
            </div>
            <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem" }}>
              <button className="btn-base btn-secondary">Compartir</button>
              <Link className="btn-base btn-primary" to="/blogs">Volver a Blogs</Link>
            </div>
          </article>

          <section className="section-base">
            <h2 className="text-center">Otros Artículos</h2>
            <div className="blogs-grid container">
              {otros.map((o) => (
                <article key={o.id} className="blog-card blog-elev">
                  <div className="blog-thumb"><img src={o.imagen} alt={o.titulo} /></div>
                  <div className="blog-content">
                    <h3 className="blog-title">{o.titulo}</h3>
                    <p className="text-muted">
                      {new Date(o.fecha).toLocaleDateString()} · {o.autor} · {o.categoria}
                    </p>
                    <p className="blog-excerpt">{o.descripcion}</p>
                    <Link className="btn-base btn-secondary btn-sm" to={`/blog/${o.id}`}>Leer más</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
