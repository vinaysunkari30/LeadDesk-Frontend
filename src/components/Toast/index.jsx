import { useEffect, useState } from "react";

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const colors = {
  success: {
    border: "border-emerald-500/40",
    icon: "text-emerald-400 bg-emerald-500/15",
    bar: "bg-emerald-500",
  },
  error: {
    border: "border-rose-500/40",
    icon: "text-rose-400 bg-rose-500/15",
    bar: "bg-rose-500",
  },
  info: {
    border: "border-blue-500/40",
    icon: "text-blue-400 bg-blue-500/15",
    bar: "bg-blue-500",
  },
};

const Toast = ({ id, type = "info", message, onClose, duration = 4000 }) => {
  const [exiting, setExiting] = useState(false);
  const c = colors[type];

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), duration - 400);
    const closeTimer = setTimeout(() => onClose(id), duration);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [id, duration, onClose]);

  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-xl glass-dark border ${c.border} shadow-2xl min-w-[280px] max-w-[360px] overflow-hidden ${exiting ? "toast-exit" : "toast-enter"}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${c.icon}`}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 font-inter leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => { setExiting(true); setTimeout(() => onClose(id), 400); }}
        className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${c.bar} opacity-60`}
        style={{ animation: `shrink ${duration}ms linear forwards` }}
      />
      <style>{`@keyframes shrink { from { width: 100% } to { width: 0% } }`}</style>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => (
  <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div key={t.id} className="pointer-events-auto">
        <Toast {...t} onClose={onClose} />
      </div>
    ))}
  </div>
);

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default Toast;
