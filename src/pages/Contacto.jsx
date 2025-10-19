import React,{useState} from 'react';
export default function Contacto(){
  const [f,setF]=useState({nombre:'',email:'',mensaje:''});
  const onChange=e=>setF(s=>({...s,[e.target.name]:e.target.value}));
  const submit=e=>{e.preventDefault(); alert('Mensaje enviado (demo)'); setF({nombre:'',email:'',mensaje:''});};
  return (<main className="app-main">
    <section className="section-hero"><div className="hero-content"><h2>Contacto</h2><p>¿Tienes alguna pregunta? ¡Escríbenos!</p></div></section>
    <section className="section-base">
      <div className="card form-card">
        <h3>Formulario de Contacto</h3>
        <form onSubmit={submit} className="form">
          <label>Nombre completo *<input name="nombre" value={f.nombre} onChange={onChange} required/></label>
          <label>Correo Electrónico *<input type="email" name="email" value={f.email} onChange={onChange} required/></label>
          <label>Comentario *<textarea name="mensaje" rows="6" value={f.mensaje} onChange={onChange} required/></label>
          <button className="btn-base btn-primary">Enviar</button>
        </form>
      </div>
    </section>
  </main>);
}
