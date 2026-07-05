import React from 'react';
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
}