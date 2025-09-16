"use client";
import { Button } from "@/components/ui/button";
import { DrawerTrigger } from "@/components/ui/drawer";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import ExportCSVButton from "./ExportCSVButton";
import AddApplication from "./modal/AddApplication";
import ImportApplicationModal from "./modal/ImportApplicationModal";

interface DashboardHeaderProps {
  dataForCsv: any[];
}

export default function DashboardHeader({ dataForCsv }: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold md:text-3xl"
      >
        Your Job Applications
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2"
      >
        {/* Action buttons */}
        <div className="flex gap-2">
          <ImportApplicationModal />
          <ExportCSVButton data={dataForCsv} />
        </div>

        {/* Mobile Schedule Button */}
        <div className="md:hidden">
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full items-center gap-2"
              size={undefined}
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
          </DrawerTrigger>
        </div>

        {/* Add application modal */}
        <AddApplication />
      </motion.div>
    </div>
  );
}
