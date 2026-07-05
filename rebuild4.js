const fs = require('fs');
const path = require('path');

const files = {
  'src/components/common/Avatar.jsx': `import React from 'react';
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
}`,
  'src/components/common/Badge.jsx': `import React from 'react';
import { cn } from '../../utils/cn';
const variants = {
  neutral: 'bg-industrial-700 text-industrial-200 border-industrial-600',
  primary: 'bg-ai-core/20 text-ai-core border-ai-core/30',
  success: 'bg-ai-success/20 text-ai-success border-ai-success/30',
  warning: 'bg-ai-warning/20 text-ai-warning border-ai-warning/30',
  danger: 'bg-ai-danger/20 text-ai-danger border-ai-danger/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
};
export default function Badge({ children, variant = 'neutral', className }) {
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', variants[variant], className)}>{children}</span>;
}`,
  'src/components/common/Card.jsx': `import React from 'react';
import { cn } from '../../utils/cn';
export function Card({ className, ...props }) {
  return <div className={cn('rounded-xl border border-industrial-700 bg-industrial-800 text-industrial-100 shadow-panel overflow-hidden', className)} {...props} />;
}
export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6 border-b border-industrial-700/50', className)} {...props} />;
}
export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight text-white', className)} {...props} />;
}
export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-4', className)} {...props} />;
}
export function CardFooter({ className, ...props }) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}`,
  'src/components/common/Input.jsx': `import React from 'react';
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
}`,
  'src/components/common/Table.jsx': `import React from 'react';
import { cn } from '../../utils/cn';
export function Table({ className, ...props }) {
  return <div className="w-full overflow-auto"><table className={cn('w-full caption-bottom text-sm', className)} {...props} /></div>;
}
export function TableHeader({ className, ...props }) {
  return <thead className={cn('[&_tr]:border-b border-industrial-700 bg-industrial-900/50', className)} {...props} />;
}
export function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}
export function TableRow({ className, ...props }) {
  return <tr className={cn('border-b border-industrial-700 transition-colors hover:bg-industrial-800/50 data-[state=selected]:bg-industrial-800', className)} {...props} />;
}
export function TableHead({ className, ...props }) {
  return <th className={cn('h-12 px-4 text-left align-middle font-medium text-industrial-400 [&:has([role=checkbox])]:pr-0', className)} {...props} />;
}
export function TableCell({ className, ...props }) {
  return <td className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />;
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, 'frontend', filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filepath);
});
