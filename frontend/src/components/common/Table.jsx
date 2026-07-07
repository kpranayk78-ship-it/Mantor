import React from 'react';
import { cn } from '../../utils/cn';
export function Table({ className, ...props }) {
  return <div className="w-full overflow-auto border border-industrial-700 rounded-lg"><table className={cn('w-full caption-bottom text-sm bg-industrial-900', className)} {...props} /></div>;
}
export function TableHeader({ className, ...props }) {
  return <thead className={cn('[&_tr]:border-b border-industrial-700 bg-industrial-800', className)} {...props} />;
}
export function TableBody({ className, ...props }) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}
export function TableRow({ className, ...props }) {
  return <tr className={cn('border-b border-industrial-700 transition-colors hover:bg-industrial-800/50 data-[state=selected]:bg-industrial-800', className)} {...props} />;
}
export function TableHead({ className, ...props }) {
  return <th className={cn('h-11 px-4 text-left align-middle font-medium text-industrial-400 [&:has([role=checkbox])]:pr-0', className)} {...props} />;
}
export function TableCell({ className, ...props }) {
  return <td className={cn('p-4 align-middle text-industrial-100 [&:has([role=checkbox])]:pr-0', className)} {...props} />;
}