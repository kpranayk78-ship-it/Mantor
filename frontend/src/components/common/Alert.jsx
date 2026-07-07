import React, { useState } from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { cn } from '../../utils/cn';
const typeStyles = { info: 'bg-industrial-900 text-blue-600 border-blue-500/30', success: 'bg-industrial-900 text-ai-success border-ai-success/30', warning: 'bg-industrial-900 text-ai-warning border-ai-warning/30', error: 'bg-industrial-900 text-ai-danger border-ai-danger/30' };
const icons = { info: FaInfoCircle, success: FaCheckCircle, warning: FaExclamationTriangle, error: FaTimesCircle };
export default function Alert({ type = 'info', title, message, dismissible = false, className }) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  const Icon = icons[type];
  return (
    <div className={cn('relative rounded-md border p-4 flex gap-3', typeStyles[type], className)}>
      <div className="flex-shrink-0 mt-0.5"><Icon className="h-5 w-5" /></div>
      <div className="flex-1">
        {title && <h3 className="text-sm font-medium mb-1 text-industrial-100">{title}</h3>}
        <div className="text-sm text-industrial-400">{message}</div>
      </div>
      {dismissible && <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 text-industrial-400 hover:text-industrial-100 transition-colors"><FaTimes className="h-4 w-4" /></button>}
    </div>
  );
}