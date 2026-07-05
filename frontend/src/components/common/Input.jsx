import React from 'react';
import { cn } from '../../utils/cn';
export default function Input({ label, error, helperText, className, id, iconLeft, iconRight, ...props }) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-industrial-300 mb-1">{label}</label>}
      <div className="relative">
        {iconLeft && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-industrial-400">{iconLeft}</div>}
        <input id={id} className={cn('input-field w-full', iconLeft && 'pl-10', iconRight && 'pr-10', error && 'border-ai-danger focus:ring-ai-danger', className)} {...props} />
        {iconRight && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-industrial-400">{iconRight}</div>}
      </div>
      {error && <p className="mt-1 text-sm text-ai-danger">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-industrial-400">{helperText}</p>}
    </div>
  );
}