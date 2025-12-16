import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogsService } from "../services/api.js";
import { Spinner } from "react-bootstrap";

export default function Blogs() {
  const nav = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const blogsData = await blogsService.getAll(true); //solo blogs publicados
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
        setError(null);
      } catch (error) {
        console.error('Error al cargar blogs:', error);
        setError('Error al cargar los blogs. Por favor, intenta nuevamente.');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  if (loading) {
    return (
      <>
        <section className="page-hero"><h2>Blogs</h2></section>
        <section className="section-base">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando blogs...</span>
            </Spinner>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-hero"><h2>Blogs</h2></section>

      <section className="section-base">
        <h2 className="text-center">Últimas publicaciones</h2>

        {error && (
          <div className="container">
            <div className="alert alert-error" style={{marginBottom: '2rem'}}>
              {error}
            </div>
          </div>
        )}

        <div className="container blogs-tiles">
          {blogs && blogs.length > 0 ? (
            blogs.map((b) => {
              const fecha = b.fecha_publicacion || b.fecha;
              return (
                <article key={b.id} className="card padded blog-card">
                  {b.imagen && (
                    <div className="thumb">
                      <img src={b.imagen} alt={b.titulo || 'Blog'} />
                    </div>
                  )}

                  <div>
                    <h2 style={{marginTop:0}}>{b.titulo}</h2>
                    <div className="meta">
                      {fecha ? new Date(fecha).toLocaleDateString() : 'Sin fecha'} · {b.autor?.nombre || b.autor || 'Sin autor'} {b.categoria && `· ${b.categoria}`}
                    </div>
                    <p>{b.excerpt || b.descripcion || "No hay descripción disponible."}</p>

                    <button
                      className="btn-base btn-orange"
                      onClick={() => nav(`/blog/${b.id}`)}
                    >
                      Leer más
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="text-center">
              <p>No hay blogs disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
