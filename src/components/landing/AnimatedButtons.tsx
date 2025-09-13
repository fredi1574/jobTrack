"use client";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

export default function AnimatedButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
    >
      <motion.div
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        }}
        className="rounded-full"
      >
        <Button
          variant="default"
          size="lg"
          className="transform rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
          asChild
        >
          <Link href="/register">Get Started - It&apos;s Free!</Link>
        </Button>
      </motion.div>
      <motion.div
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        }}
        className="rounded-full"
      >
        <Button
          variant="outline"
          size="lg"
          className="transform rounded-full border-2 border-blue-600 bg-gray-200 px-8 py-3 text-lg font-semibold text-blue-600 shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-100 hover:text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700"
          asChild
        >
          <Link href="/login">Sign In</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
