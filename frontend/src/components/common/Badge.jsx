import React from 'react';
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
}