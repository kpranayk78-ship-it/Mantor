import React from 'react';
import { cn } from '../../utils/cn';
import Spinner from './Spinner';
const variantStyles = { primary: 'bg-ai-core text-white hover:bg-ai-glow border-transparent', secondary: 'bg-industrial-700 text-industrial-100 hover:bg-industrial-600 border-industrial-600', danger: 'bg-ai-danger text-white hover:bg-red-400', ghost: 'bg-transparent text-industrial-300 hover:text-white hover:bg-industrial-800' };
const sizeStyles = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };
export default function Button({ children, className, variant = 'primary', size = 'md', isLoading = false, icon, disabled, ...props }) {
  return (
    <button className={cn('inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-300', variantStyles[variant], sizeStyles[size], (disabled || isLoading) && 'opacity-50 cursor-not-allowed hover:shadow-none', className)} disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner className="mr-2 h-4 w-4" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}