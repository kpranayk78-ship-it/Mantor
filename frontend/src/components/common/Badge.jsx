import React from 'react';
import { cn } from '../../utils/cn';
const variants = {
  neutral: 'bg-industrial-800 text-industrial-100 border-industrial-700',
  primary: 'bg-industrial-900 text-ai-core border-ai-core/30',
  success: 'bg-industrial-900 text-ai-success border-ai-success/30',
  warning: 'bg-industrial-900 text-ai-warning border-ai-warning/30',
  danger: 'bg-industrial-900 text-ai-danger border-ai-danger/30',
  info: 'bg-industrial-900 text-blue-600 border-blue-500/30'
};
export default function Badge({ children, variant = 'neutral', className }) {
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border', variants[variant], className)}>{children}</span>;
}