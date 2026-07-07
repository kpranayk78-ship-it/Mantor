import React from 'react';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';
const variantStyles = { primary: 'bg-ai-core text-white hover:opacity-90 border-transparent', secondary: 'bg-industrial-900 text-industrial-100 hover:bg-industrial-800 border-industrial-700', danger: 'bg-ai-danger text-white hover:opacity-90 border-transparent', ghost: 'bg-transparent text-industrial-300 hover:text-industrial-100 hover:bg-industrial-800 border-transparent' };
const sizeStyles = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
export default function Button({ children, className, variant = 'primary', size = 'md', isLoading = false, icon, disabled, ...props }) {
  return (
    <button className={cn('inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-150', variantStyles[variant], sizeStyles[size], (disabled || isLoading) && 'opacity-50 cursor-not-allowed', className)} disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner className="mr-2 h-4 w-4" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}