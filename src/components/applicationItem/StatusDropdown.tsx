import { updateApplicationStatus } from "@/app/actions";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Application as PrismaApplication } from "@prisma/client";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

import {
  POSSIBLE_APPLICATION_STATUSES,
  STATUS_COLORS,
  STATUS_ICONS,
} from "@/lib/constants";
import { ApplicationStatus } from "@/types/application";

interface StatusDropdownProps {
  application: PrismaApplication;
}

export default function StatusDropdown({
  application,
}: StatusDropdownProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    startTransition(async () => {
      try {
        const result = await updateApplicationStatus(application.id, newStatus);
        if (result?.success) {
          toast.success(`Status updated to ${newStatus}`, {
            icon: <span>🔄</span>,
          });
          router.refresh();
        } else {
          toast.error(result?.error || "Failed to update status.");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status.");
      }
    });
  };

  return (
    <div
      className="mt-1 flex w-auto items-center justify-center sm:mt-0 sm:w-1/6"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              `h-auto ${STATUS_COLORS[application.status.toLowerCase()]} w-full justify-center border-none px-2.5 py-0.5 text-sm font-semibold ${isPending ? "animate-pulse cursor-default" : "cursor-pointer"}`,
            )}
          >
            <div className="flex items-center justify-center gap-1">
              {STATUS_ICONS[application.status.toLowerCase()]}
              <span>{application.status}</span>
            </div>
            {isPending ? (
              <span className="ml-1 animate-spin">⏳</span>
            ) : (
              <ChevronDown className="ml-1 size-3 transition-transform group-data-[state=open]:rotate-180" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-x-scroll bg-sky-50 p-2 dark:bg-indigo-950">
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0">
            {POSSIBLE_APPLICATION_STATUSES.map((statusOption) => (
              <DropdownMenuItem
                inset={false}
                key={statusOption}
                disabled={isPending || application.status === statusOption}
                onSelect={() => handleStatusChange(statusOption)}
                className={`${STATUS_COLORS[statusOption.toLowerCase()]} mx-1 h-7 cursor-pointer items-center rounded-lg p-2 py-6 transition-colors md:py-2`}
              >
                <div className="flex flex-1 items-center justify-center gap-1">
                  {STATUS_ICONS[statusOption.toLowerCase()]}
                  {statusOption}
                </div>
                {application.status === statusOption ? (
                  <Check className="w-4" />
                ) : (
                  <span className="w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
