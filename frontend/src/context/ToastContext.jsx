import React, { createContext, useContext, useState, useCallback, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((toast) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { ...toast, id }]);
    if (toast.duration !== Infinity) {
      setTimeout(() => removeToast(id), toast.duration || 5000);
    }
    return id;
  }, []);
  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  const toast = {
    success: (msg, opts) => addToast({ type: 'success', message: msg, ...opts }),
    error: (msg, opts) => addToast({ type: 'error', message: msg, ...opts }),
    warning: (msg, opts) => addToast({ type: 'warning', message: msg, ...opts }),
    info: (msg, opts) => addToast({ type: 'info', message: msg, ...opts }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

function ToastContainer({ toasts, removeToast }) {
  const icons = {
    success: <FaCheckCircle className="text-ai-success w-5 h-5" />,
    error: <FaTimesCircle className="text-ai-danger w-5 h-5" />,
    warning: <FaExclamationTriangle className="text-ai-warning w-5 h-5" />,
    info: <FaInfoCircle className="text-ai-core w-5 h-5" />,
  };
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 sm:p-6 flex flex-col gap-3 pointer-events-none w-full sm:w-auto max-w-sm">
      {toasts.map((t) => (
        <Transition key={t.id} show={true} appear={true} as={Fragment}
          enter="transform ease-out duration-300 transition" enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4" enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="pointer-events-auto w-full bg-industrial-800 border border-industrial-700 rounded-lg shadow-panel p-4 flex items-start gap-3 relative">
            <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
            <div className="flex-1"><p className="text-sm font-medium text-white">{t.message}</p></div>
            <button onClick={() => removeToast(t.id)} className="flex-shrink-0 ml-4 text-industrial-400 hover:text-white transition-colors"><FaTimes /></button>
          </div>
        </Transition>
      ))}
    </div>
  );
}