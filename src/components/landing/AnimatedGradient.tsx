"use client";
import { motion } from "motion/react";

export default function AnimatedGradient() {
  return (
    <div className="absolute inset-0 z-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-300 to-rose-300 opacity-50 blur-3xl dark:from-blue-900 dark:to-purple-900"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{
          duration: 5,
          delay: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-teal-300 to-indigo-300 opacity-20 blur-3xl dark:from-teal-900 dark:to-indigo-900"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{
          duration: 6,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-yellow-300 to-pink-300 opacity-30 blur-3xl dark:from-yellow-900 dark:to-pink-900"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{
          duration: 2.5,
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute right-1/2 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-green-300 to-cyan-300 opacity-40 blur-3xl dark:from-green-900 dark:to-cyan-900"
      />
    </div>
  );
}
