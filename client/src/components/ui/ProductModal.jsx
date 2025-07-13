"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function ProductModal({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold text-gray-900 dark:text-white"
                >
                  {product.name}
                </Dialog.Title>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Brand:</strong> {product.brand || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Ingredients:</strong> {product.ingredients_text || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Packaging:</strong> {product.packaging || "N/A"}
                  </p>
                </div>

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="mt-4 rounded-lg object-contain w-full max-h-64"
                  />
                )}

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
