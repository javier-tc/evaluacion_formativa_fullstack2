import React from "react";
import { useNavigate } from "react-router-dom";
import { BLOGS } from "../data/blogs.js";

export default function Blogs() {
  const nav = useNavigate();
  return (
    <>
      <section className="page-hero"><h2>Blogs</h2></section>

      <section className="section-base">
        <h2 className="text-center">Últimas publicaciones</h2>

        <div className="container blogs-tiles">
          {BLOGS.map((b) => (
            <article key={b.id} className="card padded blog-card">
              <div className="thumb">
                <img src={b.imagen} alt={b.titulo} />
              </div>

              <div>
                <h2 style={{marginTop:0}}>{b.titulo}</h2>
                <div className="meta">
                  {new Date(b.fecha).toLocaleDateString()} · {b.autor} · {b.categoria}
                </div>
                <p>{b.descripcion}</p>

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
