import React from 'react';
import { cn } from '../../utils/cn';
export function Card({ className, ...props }) {
  return <div className={cn('rounded-lg border border-industrial-700 bg-industrial-900 text-industrial-100 shadow-sm overflow-hidden', className)} {...props} />;
}
export function CardHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1 p-5 border-b border-industrial-700/50', className)} {...props} />;
}
export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-medium leading-none tracking-tight text-industrial-100', className)} {...props} />;
}
export function CardContent({ className, ...props }) {
  return <div className={cn('p-5 pt-4', className)} {...props} />;
}
export function CardFooter({ className, ...props }) {
  return <div className={cn('flex items-center p-5 pt-0', className)} {...props} />;
}