const fs = require('fs');
const path = require('path');

const files = {
  'src/components/common/Modal.jsx': `import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
export default function Modal({ isOpen, onClose, title, children, className }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className={\`w-full max-w-md transform overflow-hidden rounded-xl bg-industrial-900 border border-industrial-700 p-6 text-left align-middle shadow-panel transition-all \${className || ''}\`}>
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-white">{title}</Dialog.Title>
                  <button onClick={onClose} className="text-industrial-400 hover:text-white transition-colors"><FaTimes /></button>
                </div>
                <div className="mt-2 text-industrial-300">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}`,
  'src/components/common/Dropdown.jsx': `import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
import { cn } from '../../utils/cn';
export default function Dropdown({ trigger, items, className, menuClassName }) {
  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button as={Fragment}>
        {trigger || (
          <button className="inline-flex w-full justify-center rounded-lg bg-industrial-800 px-4 py-2 text-sm font-medium text-white hover:bg-industrial-700 border border-industrial-600 transition-colors">
            Options <FaChevronDown className="-mr-1 ml-2 h-5 w-5 text-industrial-400" />
          </button>
        )}
      </Menu.Button>
      <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
        <Menu.Items className={cn('absolute right-0 mt-2 w-56 origin-top-right divide-y divide-industrial-700 rounded-md bg-industrial-800 shadow-panel ring-1 ring-black/5 focus:outline-none z-50', menuClassName)}>
          <div className="px-1 py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button onClick={item.onClick} className={cn(active ? 'bg-ai-core text-white' : 'text-industrial-100', 'group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors')}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}`,
  'src/components/common/Tabs.jsx': `import React from 'react';
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
}`,
  'src/components/common/SearchBar.jsx': `import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Input from './Input';
import { cn } from '../../utils/cn';
export default function SearchBar({ onSearch, placeholder = 'Search...', debounceMs = 300, className, ...props }) {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => { if (onSearch) onSearch(query); }, debounceMs);
    return () => clearTimeout(handler);
  }, [query, onSearch, debounceMs]);
  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <Input type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} iconLeft={<FaSearch />} className={query ? 'pr-10' : ''} {...props} />
      {query && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-industrial-400 hover:text-white" onClick={() => setQuery('')}><FaTimes /></button>}
    </div>
  );
}`,
  'src/components/common/Pagination.jsx': `import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Button from './Button';
export default function Pagination({ currentPage, totalPages, onPageChange, className }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className={\`flex items-center gap-2 \${className}\`}>
      <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} icon={<FaChevronLeft />}>Prev</Button>
      <div className="flex gap-1">
        {pages.map(page => (
          <Button key={page} variant={currentPage === page ? 'primary' : 'ghost'} size="sm" onClick={() => onPageChange(page)} className="w-8 h-8 p-0">{page}</Button>
        ))}
      </div>
      <Button variant="ghost" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next <FaChevronRight className="ml-2" /></Button>
    </div>
  );
}`,
  'src/components/common/Alert.jsx': `import React, { useState } from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import { cn } from '../../utils/cn';
const typeStyles = { info: 'bg-ai-core/10 text-ai-core border-ai-core/20', success: 'bg-ai-success/10 text-ai-success border-ai-success/20', warning: 'bg-ai-warning/10 text-ai-warning border-ai-warning/20', error: 'bg-ai-danger/10 text-ai-danger border-ai-danger/20' };
const icons = { info: FaInfoCircle, success: FaCheckCircle, warning: FaExclamationTriangle, error: FaTimesCircle };
export default function Alert({ type = 'info', title, message, dismissible = false, className }) {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  const Icon = icons[type];
  return (
    <div className={cn('relative rounded-lg border p-4 flex gap-3', typeStyles[type], className)}>
      <div className="flex-shrink-0 mt-0.5"><Icon className="h-5 w-5" /></div>
      <div className="flex-1">
        {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
        <div className="text-sm opacity-90">{message}</div>
      </div>
      {dismissible && <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity"><FaTimes className="h-4 w-4" /></button>}
    </div>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, 'frontend', filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filepath);
});
