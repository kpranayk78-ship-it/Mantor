import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
import { cn } from '../../utils/cn';
export default function Dropdown({ trigger, items, className, menuClassName }) {
  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button as={Fragment}>
        {trigger || (
          <button className="inline-flex w-full justify-center rounded-md bg-industrial-900 px-3 py-1.5 text-sm font-medium text-industrial-100 hover:bg-industrial-800 border border-industrial-700 transition-colors shadow-sm">
            Options <FaChevronDown className="-mr-1 ml-2 h-4 w-4 text-industrial-400" />
          </button>
        )}
      </Menu.Button>
      <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
        <Menu.Items className={cn('absolute right-0 mt-1 w-56 origin-top-right rounded-md bg-industrial-900 shadow-sm border border-industrial-700 focus:outline-none z-50 p-1', menuClassName)}>
          {items.map((item, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <button onClick={item.onClick} className={cn(active ? 'bg-industrial-800 text-industrial-100' : 'text-industrial-400', 'group flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors')}>
                  {item.icon && <span className={cn('mr-2', active ? 'text-industrial-100' : 'text-industrial-400')}>{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}