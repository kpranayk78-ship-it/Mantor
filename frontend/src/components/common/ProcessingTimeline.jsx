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

const pipelineStages = [
  { id: 'Uploaded', label: 'Uploaded', icon: FaCloudUploadAlt },
  { id: 'Parsing', label: 'Parsing', icon: FaSpinner },
  { id: 'Parsed', label: 'Parsed', icon: FaFileAlt },
  { id: 'Chunked', label: 'Chunked', icon: FaLayerGroup },
  { id: 'Embedded', label: 'Embedded', icon: FaProjectDiagram },
  { id: 'Indexed', label: 'Indexed', icon: FaCheckCircle },
];

export default function ProcessingTimeline({ currentStatus = 'Chunked', isFailed = false }) {
  // Mock data/logic to determine step states based on currentStatus
  const currentIndex = pipelineStages.findIndex(s => s.id === currentStatus);
  
  return (
    <div className="flex flex-col space-y-4 py-2">
      {pipelineStages.map((stage, index) => {
        const isCompleted = index < currentIndex || (index === currentIndex && !isFailed && currentStatus === 'Indexed');
        const isActive = index === currentIndex && !isFailed && currentStatus !== 'Indexed';
        const isPending = index > currentIndex;
        const isError = index === currentIndex && isFailed;

        const Icon = isError ? FaExclamationTriangle : stage.icon;

        let iconColorClass = 'text-industrial-500 bg-industrial-800 border-industrial-700';
        let lineClass = 'bg-industrial-700';

        if (isCompleted) {
          iconColorClass = 'text-ai-success bg-industrial-900 border-ai-success/30';
          lineClass = 'bg-ai-success/50';
        } else if (isActive) {
          iconColorClass = 'text-ai-core bg-industrial-900 border-ai-core/50 shadow-sm';
          lineClass = 'bg-industrial-700';
        } else if (isError) {
          iconColorClass = 'text-ai-danger bg-industrial-900 border-ai-danger/50';
          lineClass = 'bg-industrial-700';
        }

        return (
          <div key={stage.id} className="relative flex gap-4 items-start group">
            {/* Vertical Line Connector */}
            {index < pipelineStages.length - 1 && (
              <div className={cn('absolute left-[15px] top-8 bottom-[-16px] w-[2px]', lineClass)} />
            )}
            
            {/* Icon Node */}
            <div className={cn(
              'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border',
              iconColorClass
            )}>
              <Icon size={14} className={cn(isActive && stage.id === 'Parsing' && 'animate-spin')} />
            </div>

            {/* Label & Details */}
            <div className="flex-1 pt-1">
              <p className={cn(
                'text-sm font-medium transition-colors',
                isCompleted || isActive ? 'text-industrial-100' : 'text-industrial-500',
                isError && 'text-ai-danger'
              )}>
                {isError ? 'Failed' : stage.label}
              </p>
              {isActive && (
                <p className="text-xs text-industrial-400 mt-0.5">Processing...</p>
              )}
              {isCompleted && (
                <p className="text-xs text-industrial-500 mt-0.5">Complete</p>
              )}
              {isError && (
                <p className="text-xs text-ai-danger/70 mt-0.5">An error occurred during this step.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
