import React from 'react';
import { useCart } from '../contexts/CartContext.jsx';
export default function Carrito(){
  const {items,totalPrice,remove,clear}=useCart();
  return (<main className="section-base app-main"><h2 className="text-center">Mi Carrito</h2>
    {items.length===0? <p className="text-center">Tu carrito está vacío</p> :
    <div style={{maxWidth:'800px',margin:'0 auto'}}>
      {items.map(i=>(<div key={i.id} style={{display:'flex',gap:'1rem',alignItems:'center',padding:'.75rem 0',borderBottom:'1px solid #eee'}}>
        <img src={i.image} alt={i.name} style={{width:'64px',height:'64px',objectFit:'cover',borderRadius:'8px'}}/>
        <div style={{flex:1}}><strong>{i.name}</strong><div className="text-muted">{i.artist}</div></div>
        <div>${(i.qty*i.price).toLocaleString()}</div>
        <button className="btn-base btn-secondary" onClick={()=>remove(i.id)}>Quitar</button>
      </div>))}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:'1rem'}}>
        <strong>Total: ${totalPrice.toLocaleString()}</strong>
        <div style={{display:'flex',gap:'.5rem'}}>
          <button className="btn-base btn-secondary" onClick={clear}>Vaciar</button>
          <button className="btn-base btn-primary">Proceder al Pago</button>
        </div>
      </div>
    </div>}
  </main>);
}
