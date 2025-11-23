import React, { createContext, useCallback, useState } from "react";
import Toasts from "./ui/Toasts";

export const ToastContext = createContext({ showToast: (msg, opts) => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, { duration = 3500, type = "info" } = {}) => {
    const id = String(Date.now()) + "-" + Math.floor(Math.random() * 1000);
    const t = { id, message, type };
    setToasts((s) => [...s, t]);
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toasts toasts={toasts} />
    </ToastContext.Provider>
  );
}


