import React, { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const push = useCallback((type, msg) => {
    const id = Math.random().toString(36).slice(2);
    setList((prev) => [...prev, { id, type, msg }]);
    setTimeout(() => setList((prev) => prev.filter(t => t.id !== id)), 2400);
  }, []);
  const value = {
    success: (m) => push("success", m),
    error:   (m) => push("error", m),
    info:    (m) => push("info", m),
  };
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toast-portal">
        {list.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
