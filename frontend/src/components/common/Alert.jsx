import React, { useState } from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { cn } from '../../utils/cn';
const typeStyles = { info: 'bg-ai-core/10 text-ai-core border-ai-core/20', success: 'bg-ai-success/10 text-ai-success border-ai-success/20', warning: 'bg-ai-warning/10 text-ai-warning border-ai-warning/20', error: 'bg-ai-danger/10 text-ai-danger border-ai-danger/20' };
const icons = { info: FaInfoCircle, success: FaCheckCircle, warning: FaExclamationTriangle, error: FaTimesCircle };
export default function Alert({ type = 'info', title, message, dismissible = false, className }) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  const Icon = icons[type];
  return (
    <div className={cn('relative rounded-lg border p-4 flex gap-3', typeStyles[type], className)}>
      <div className="flex-shrink-0 mt-0.5"><Icon className="h-5 w-5" /></div>
      <div className="flex-1">
        {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
        <div className="text-sm opacity-90">{message}</div>
      </div>
      {dismissible && <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity"><FaTimes className="h-4 w-4" /></button>}
    </div>
  );
}