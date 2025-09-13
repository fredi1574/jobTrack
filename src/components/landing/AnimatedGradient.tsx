"use client";
import { motion } from "motion/react";

export default function AnimatedGradient() {
  return (
    <div className="absolute inset-0 z-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-300 to-rose-300 opacity-50 blur-3xl dark:from-blue-900 dark:to-purple-900"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{
          duration: 2,
          delay: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-teal-300 to-indigo-300 opacity-20 blur-3xl dark:from-teal-900 dark:to-indigo-900"
      />
    </div>
  );
}
