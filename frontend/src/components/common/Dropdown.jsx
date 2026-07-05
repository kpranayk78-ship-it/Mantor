import React, { Fragment } from 'react';
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
}