import React,{createContext,useContext,useMemo,useState} from 'react';

const Ctx=createContext(null);
export function CartProvider({children}){
  const [items,setItems]=useState([]);
  const add=item=>setItems(p=>{const f=p.find(i=>i.id===item.id); return f? p.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i):[...p,{...item,qty:1}]});
  const remove=id=>setItems(p=>p.filter(i=>i.id!==id));
  const clear=()=>setItems([]);
  const totalItems=useMemo(()=>items.reduce((s,i)=>s+i.qty,0),[items]);
  const totalPrice=useMemo(()=>items.reduce((s,i)=>s+(i.qty || 0)*(Number(i.precio) || Number(i.price) || 0),0),[items]);
  return <Ctx.Provider value={{items,add,remove,clear,totalItems,totalPrice}}>{children}</Ctx.Provider>
}
export const useCart=()=>useContext(Ctx);
