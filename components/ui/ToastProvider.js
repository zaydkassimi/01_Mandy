import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = String(Date.now()) + "-" + Math.floor(Math.random() * 1000);
    const t = { id, ...toast };
    setToasts((s) => [t, ...s]);
    // auto remove
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, toast.duration || 4000);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="max-w-xs w-full bg-white border rounded-md shadow-lg p-3">
            <div className="font-semibold text-sm">{t.title}</div>
            {t.description && <div className="text-sm text-gray-600 mt-1">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.addToast;
}


