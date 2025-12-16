import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogsService } from "../services/api.js";
import { Spinner } from "react-bootstrap";

export default function DetalleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [otros, setOtros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const [blogData, todosBlogs] = await Promise.all([
          blogsService.getById(id),
          blogsService.getAll(true)
        ]);
        setBlog(blogData);
        //filtrar otros blogs excluyendo el actual
        const otrosBlogs = Array.isArray(todosBlogs) 
          ? todosBlogs.filter((b) => String(b.id) !== String(id)).slice(0, 3)
          : [];
        setOtros(otrosBlogs);
        setError(null);
      } catch (error) {
        console.error('Error al cargar blog:', error);
        setError('Error al cargar el blog. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="section-base">
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando blog...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (!blog && !loading) {
    return (
      <div className="section-base">
        <div className="container">
          <h2>Publicación no encontrada</h2>
          {error && (
            <div className="alert alert-error" style={{marginTop: '1rem'}}>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  const b = blog;

  return (
    <>
      <section className="section-base">
        <div className="container">
          <div className="blog-hero">
            {b.imagen && <img src={b.imagen} alt={b.titulo || 'Blog'} />}
            <div>
              <h1>{b.titulo}</h1>
              <div className="text-muted">
                {(b.fecha_publicacion || b.fecha) ? new Date(b.fecha_publicacion || b.fecha).toLocaleDateString() : 'Sin fecha'} · {b.autor?.nombre || b.autor || 'Sin autor'}
              </div>
              {b.categoria && <span className="blog-chip">{b.categoria}</span>}
            </div>
          </div>

          <article className="blog-detail">
            <div className="body">
              <p>{b.contenido || b.descripcion || "No hay contenido disponible."}</p>
            </div>
            <div style={{ display: "flex", gap: ".75rem", marginTop: "1.5rem" }}>
              <button className="btn-base btn-secondary">Compartir</button>
              <Link className="btn-base btn-primary" to="/blogs">Volver a Blogs</Link>
            </div>
          </article>

          {otros && otros.length > 0 && (
            <section className="section-base">
              <h2 className="text-center">Otros Artículos</h2>
              <div className="blogs-grid container">
                {otros.map((o) => {
                  const fecha = o.fecha_publicacion || o.fecha;
                  return (
                    <article key={o.id} className="blog-card blog-elev">
                      {o.imagen && (
                        <div className="blog-thumb"><img src={o.imagen} alt={o.titulo || 'Blog'} /></div>
                      )}
                      <div className="blog-content">
                        <h3 className="blog-title">{o.titulo}</h3>
                        <p className="text-muted">
                          {fecha ? new Date(fecha).toLocaleDateString() : 'Sin fecha'} · {o.autor?.nombre || o.autor || 'Sin autor'} {o.categoria && `· ${o.categoria}`}
                        </p>
                        <p className="blog-excerpt">{o.excerpt || o.descripcion || "No hay descripción disponible."}</p>
                        <Link className="btn-base btn-secondary btn-sm" to={`/blog/${o.id}`}>Leer más</Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
