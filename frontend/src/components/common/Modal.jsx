import React, { Fragment } from 'react';
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
              <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-xl bg-industrial-900 border border-industrial-700 p-6 text-left align-middle shadow-panel transition-all ${className || ''}`}>
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
}