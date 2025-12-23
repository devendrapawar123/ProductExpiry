// src/components/ToastProvider.jsx
import React, {
  createContext,
  useContext,
  useCallback,
  useState,
} from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type, message, options = {}) => {
      const id = ++idCounter;
      const toast = {
        id,
        type, // "success" | "error" | "info" | "warning"
        message,
        title: options.title || null,
        duration: options.duration || 4000, // ms
      };

      setToasts((prev) => [...prev, toast]);

      // auto hide
      setTimeout(() => removeToast(id), toast.duration);
    },
    [removeToast]
  );

  const api = {
    show,
    success: (msg, opts) => show("success", msg, opts),
    error: (msg, opts) => show("error", msg, opts),
    info: (msg, opts) => show("info", msg, opts),
    warning: (msg, opts) => show("warning", msg, opts),
  };

  const getBgClass = (type) => {
    switch (type) {
      case "success":
        return "bg-emerald-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "warning":
        return "bg-amber-500 text-white";
      case "info":
      default:
        return "bg-slate-800 text-white";
    }
  };

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Toast list - TOP RIGHT */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "rounded-xl px-3 py-2 shadow-lg text-sm flex items-start gap-2 " +
              getBgClass(t.type)
            }
          >
            <div className="flex-1">
              {t.title && (
                <div className="font-semibold text-xs mb-0.5">
                  {t.title}
                </div>
              )}
              <div className="text-xs leading-snug">{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
