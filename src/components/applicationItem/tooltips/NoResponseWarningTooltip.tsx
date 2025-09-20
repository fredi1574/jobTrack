"use client";
import { resetLastStatusChangeDate } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClockAlert } from "lucide-react";
import { useRouter } from "next/navigation";

interface NoResponseWarningTooltipProps {
  daysSinceLastStatusChange: number;
  applicationId: string;
}

export default function NoResponseWarningTooltip({
  daysSinceLastStatusChange,
  applicationId,
}: NoResponseWarningTooltipProps) {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="mr-2 flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ClockAlert className="size-4 text-red-500" />
          </span>
        </TooltipTrigger>
        <TooltipContent color="red" className="flex flex-col gap-1">
          <p>{daysSinceLastStatusChange} days since last status change</p>
          <Button
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              resetLastStatusChangeDate(applicationId);
              router.refresh();
            }}
            variant="default"
            size="xs"
            className="p-1.5"
          >
            Wait More
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
