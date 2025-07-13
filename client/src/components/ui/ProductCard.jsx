"use client";

import { motion } from "framer-motion";

export default function ProductCard({ name, price, image, eco = true }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-zinc-900 cursor-pointer transition-all"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">₹{price}</p>
        {eco && (
          <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded-full">
            ♻️ Eco-Friendly
          </span>
        )}
      </div>
    </motion.div>
  );
}
