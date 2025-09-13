"use client";
import { motion } from "motion/react";

export default function AnimatedHeader() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold tracking-tight text-balance text-gray-900 sm:text-6xl lg:text-7xl dark:text-white"
      >
        Your Journey to Success Starts Here
        <span className="block text-blue-700 dark:text-blue-400">
          Job Application Tracker
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-gray-700 sm:text-xl dark:text-gray-300"
      >
        Effortlessly manage your job applications, track your progress, and land
        your dream job with an intuitive platform.
      </motion.p>
    </>
  );
}
