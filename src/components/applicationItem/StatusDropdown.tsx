import { updateApplicationStatus } from "@/app/actions/application";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  POSSIBLE_APPLICATION_STATUSES,
  STATUS_COLORS,
  STATUS_ICONS,
  TOAST_BACKGROUND_COLORS,
  TOAST_TEXT_COLORS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@/types/application";
import { Application as PrismaApplication } from "@prisma/client";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

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
            icon: STATUS_ICONS[newStatus.toLowerCase()],
            style: {
              backgroundColor: TOAST_BACKGROUND_COLORS[newStatus.toLowerCase()],
              color: TOAST_TEXT_COLORS[newStatus.toLowerCase()],
              border: "none",
            },
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
      className="flex items-center justify-center sm:mt-0"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              `h-auto w-full justify-center border-none px-2.5 py-0.5 text-sm font-semibold ${isPending ? "animate-pulse cursor-default" : "cursor-pointer"}`,
            )}
          >
            <div className="flex flex-1 items-center justify-center gap-1">
              {STATUS_ICONS[application.status.toLowerCase()]}
              {/* <span>{application.status}</span> */}
            </div>
            {isPending ? (
              <span className="ml-1 animate-spin">⏳</span>
            ) : (
              <ChevronDown className="ml-1 size-3 transition-transform group-data-[state=open]:rotate-180" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:bg-primary-foreground overflow-auto p-2">
          <div className="flex flex-col space-y-2">
            {POSSIBLE_APPLICATION_STATUSES.map((statusOption) => (
              <DropdownMenuItem
                inset={false}
                key={statusOption}
                disabled={isPending || application.status === statusOption}
                onSelect={() => handleStatusChange(statusOption)}
                className={`hover:bg-accent-foreground/10 flex h-7 cursor-pointer rounded-lg transition-colors`}
              >
                <div className="flex">
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
