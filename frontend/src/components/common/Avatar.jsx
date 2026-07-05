import React from 'react';
import { cn } from '../../utils/cn';
export default function Avatar({ src, fallbackInitials, size = 'md', status, className }) {
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
  const statusClasses = { online: 'bg-ai-success', offline: 'bg-industrial-500', away: 'bg-ai-warning', busy: 'bg-ai-danger' };
  return (
    <div className={cn('relative inline-flex', className)}>
      <div className={cn('rounded-full overflow-hidden flex items-center justify-center bg-industrial-700 text-white font-medium border border-industrial-600', sizeClasses[size])}>
        {src ? <img src={src} alt="Avatar" className="w-full h-full object-cover" /> : fallbackInitials}
      </div>
      {status && <span className={cn('absolute bottom-0 right-0 block rounded-full ring-2 ring-industrial-900', statusClasses[status], { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3', xl: 'w-4 h-4' }[size])} />}
    </div>
  );
}