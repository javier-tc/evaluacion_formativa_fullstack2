import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogsService } from "../services/api.js";
import { Spinner } from "react-bootstrap";

export default function Blogs() {
  const nav = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const blogsData = await blogsService.getAll(true); //solo blogs publicados
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error al cargar blogs:', error);
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

        <div className="container blogs-tiles">
          {blogs.map((b) => (
            <article key={b.id} className="card padded blog-card">
              <div className="thumb">
                <img src={b.imagen} alt={b.titulo} />
              </div>

              <div>
                <h2 style={{marginTop:0}}>{b.titulo}</h2>
                <div className="meta">
                  {b.fecha_publicacion ? new Date(b.fecha_publicacion).toLocaleDateString() : new Date(b.fecha).toLocaleDateString()} · {b.autor?.nombre || b.autor} {b.categoria && `· ${b.categoria}`}
                </div>
                <p>{b.excerpt || b.descripcion}</p>

                <button
                  className="btn-base btn-orange"
                  onClick={() => nav(`/blog/${b.id}`)}
                >
                  Leer más
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
