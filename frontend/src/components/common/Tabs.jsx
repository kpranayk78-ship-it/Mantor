import React from 'react';
import { Tab } from '@headlessui/react';
import { cn } from '../../utils/cn';
export default function Tabs({ items, className, tabListClassName, tabPanelsClassName }) {
  return (
    <Tab.Group>
      <div className={cn('w-full', className)}>
        <Tab.List className={cn('flex space-x-2 rounded-lg bg-industrial-800 p-1 mb-4', tabListClassName)}>
          {items.map((item) => (
            <Tab key={item.id} className={({ selected }) => cn('w-full rounded-md py-2.5 text-sm font-medium leading-5 transition-all outline-none', selected ? 'bg-industrial-700 text-white shadow' : 'text-industrial-400 hover:bg-industrial-700/50 hover:text-white')}>
              {item.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={tabPanelsClassName}>
          {items.map((item) => (
            <Tab.Panel key={item.id} className={cn('rounded-xl p-4 bg-industrial-800/30 border border-industrial-800 outline-none')}>
              {item.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
}