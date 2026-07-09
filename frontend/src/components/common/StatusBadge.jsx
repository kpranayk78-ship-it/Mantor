import React from 'react';
import { cn } from '../../utils/cn';
import { 
  FaCloudUploadAlt, 
  FaSpinner, 
  FaFileAlt, 
  FaLayerGroup, 
  FaProjectDiagram, 
  FaCheckCircle, 
  FaExclamationTriangle 
} from 'react-icons/fa';

const statusConfig = {
  Uploaded: {
    icon: FaCloudUploadAlt,
    colorClass: 'bg-industrial-800 text-industrial-100 border-industrial-700',
  },
  Parsing: {
    icon: FaSpinner,
    colorClass: 'bg-industrial-900 text-ai-warning border-ai-warning/30',
    spin: true,
  },
  Parsed: {
    icon: FaFileAlt,
    colorClass: 'bg-industrial-900 text-blue-500 border-blue-500/30',
  },
  Chunked: {
    icon: FaLayerGroup,
    colorClass: 'bg-industrial-900 text-purple-500 border-purple-500/30',
  },
  Embedded: {
    icon: FaProjectDiagram,
    colorClass: 'bg-industrial-900 text-ai-core border-ai-core/30',
  },
  Indexed: {
    icon: FaCheckCircle,
    colorClass: 'bg-industrial-900 text-ai-success border-ai-success/30',
  },
  Failed: {
    icon: FaExclamationTriangle,
    colorClass: 'bg-industrial-900 text-ai-danger border-ai-danger/30',
  },
};

export default function StatusBadge({ status = 'Uploaded', className }) {
  const config = statusConfig[status] || statusConfig['Uploaded'];
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium border', config.colorClass, className)}>
      <Icon className={cn(config.spin && 'animate-spin')} size={12} />
      {status}
    </span>
  );
}
