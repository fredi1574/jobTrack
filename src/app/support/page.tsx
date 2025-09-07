"use client";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card w-full rounded-lg p-6 text-center shadow-xl md:max-w-1/2 md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Coffee className="mx-auto mb-6 size-20 text-yellow-500 dark:text-yellow-400" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white"
        >
          Support My Work!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 text-lg text-gray-700 md:text-xl dark:text-gray-300"
        >
          If you find JobTrack useful, consider buying me a coffee! Your support
          helps me continue developing and improving.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8 text-base text-gray-600 dark:text-gray-400"
        >
          Your support helps keep JobTrack running and accessible to everyone.
          If you find value in this tool, please consider contributing what you
          can. Every donation, no matter the amount, makes a difference and is
          greatly appreciated!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)" }}
        >
          <Link
            href="https://buymeacoffee.com/fredi1574"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-8 py-3 text-lg font-semibold text-gray-900 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 focus:outline-none dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-700"
          >
            <Coffee className="mr-3 size-6" />
            Buy Me A Coffee!
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
