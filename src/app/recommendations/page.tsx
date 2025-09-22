"use client";
import JobRecommendationList from "@/components/JobRecommendationList";
import { motion } from "motion/react";

export default function RecommendationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-6 lg:p-10"
    >
      <h1 className="text-3xl font-bold mb-6">Job Recommendations</h1>
      <JobRecommendationList />
    </motion.div>
  );
}