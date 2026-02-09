import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | string; // bisa sm/md/lg atau custom width class
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  // ukuran modal
  const sizeClasses: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  const widthClass = sizeClasses[size] || size; // jika string custom width, pakai langsung

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Blur overlay */}
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 backdrop-blur-sm"
        />

        {/* Modal panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${widthClass} p-6 relative`}
          >
            {/* Tombol Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Judul Modal */}
            {title && (
              <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {title}
              </Dialog.Title>
            )}

            {/* Konten modal (dinamis) */}
            <div className="space-y-4">{children}</div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
