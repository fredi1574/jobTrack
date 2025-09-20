"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/time.utils";
import { Bell } from "lucide-react";

interface InterviewTooltipProps {
  interviewDate: Date;
}

export default function InterviewTooltip({
  interviewDate,
}: InterviewTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="mr-2 flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Bell className="h-4 w-4 text-yellow-500" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="left" color="purple" className={undefined}>
          <p>{formatDate(new Date(interviewDate), "dd/MM/yy HH:mm")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
