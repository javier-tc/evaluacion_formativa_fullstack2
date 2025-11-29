import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { carritoService } from '../services/api.js';

const Ctx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  //cargar carrito desde el backend cuando el usuario está autenticado
  useEffect(() => {
    const loadCarrito = async () => {
      if (isAuthenticated() && user?.id) {
        setLoading(true);
        try {
          const carrito = await carritoService.getCarrito(user.id);
          if (carrito && carrito.items) {
            //transformar items del backend al formato del frontend
            const formattedItems = carrito.items.map(item => ({
              id: item.producto_id || item.producto?.id,
              nombre: item.producto?.nombre || item.nombre,
              precio: item.precio_unitario || item.producto?.precio || item.precio,
              imagen: item.producto?.imagen || item.imagen,
              artista: item.producto?.artista || item.artista,
              qty: item.cantidad || item.qty || 1
            }));
            setItems(formattedItems);
          }
        } catch (error) {
          console.error('Error al cargar carrito:', error);
        } finally {
          setLoading(false);
        }
      } else if (!isAuthenticated()) {
        //si no está autenticado, limpiar el carrito
        setItems([]);
      }
    };

    loadCarrito();
  }, [user, isAuthenticated]);

  //agregar item al carrito
  const add = async (item) => {
    if (isAuthenticated() && user?.id) {
      try {
        await carritoService.addItem(user.id, item.id, 1);
        //actualizar estado local
        setItems(p => {
          const f = p.find(i => i.id === item.id);
          return f ? p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...p, { ...item, qty: 1 }];
        });
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        throw error;
      }
    } else {
      //si no está autenticado, usar estado local
      setItems(p => {
        const f = p.find(i => i.id === item.id);
        return f ? p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...p, { ...item, qty: 1 }];
      });
    }
  };

  //remover item del carrito
  const remove = async (id) => {
    if (isAuthenticated() && user?.id) {
      try {
        await carritoService.removeItem(user.id, id);
        setItems(p => p.filter(i => i.id !== id));
      } catch (error) {
        console.error('Error al remover del carrito:', error);
        throw error;
      }
    } else {
      setItems(p => p.filter(i => i.id !== id));
    }
  };

  //vaciar carrito
  const clear = async () => {
    if (isAuthenticated() && user?.id) {
      try {
        await carritoService.clearCarrito(user.id);
        setItems([]);
      } catch (error) {
        console.error('Error al vaciar carrito:', error);
        throw error;
      }
    } else {
      setItems([]);
    }
  };

  //actualizar cantidad de un item
  const updateQuantity = async (id, cantidad) => {
    if (isAuthenticated() && user?.id) {
      try {
        await carritoService.updateItem(user.id, id, cantidad);
        setItems(p => p.map(i => i.id === id ? { ...i, qty: cantidad } : i));
      } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        throw error;
      }
    } else {
      setItems(p => p.map(i => i.id === id ? { ...i, qty: cantidad } : i));
    }
  };

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + (i.qty || 0) * (Number(i.precio) || Number(i.price) || 0), 0), [items]);

  return (
    <Ctx.Provider value={{ items, add, remove, clear, updateQuantity, totalItems, totalPrice, loading }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
