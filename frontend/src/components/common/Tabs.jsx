import React from 'react';
import { Tab } from '@headlessui/react';
import { cn } from '../../utils/cn';
export default function Tabs({ items, className, tabListClassName, tabPanelsClassName }) {
  return (
    <Tab.Group>
      <div className={cn('w-full', className)}>
        <Tab.List className={cn('flex space-x-1 border-b border-industrial-700 mb-4', tabListClassName)}>
          {items.map((item) => (
            <Tab key={item.id} className={({ selected }) => cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors outline-none whitespace-nowrap', selected ? 'border-ai-core text-ai-core' : 'border-transparent text-industrial-400 hover:text-industrial-100 hover:border-industrial-600')}>
              {item.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={tabPanelsClassName}>
          {items.map((item) => (
            <Tab.Panel key={item.id} className={cn('outline-none')}>
              {item.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
}