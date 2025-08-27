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
import {
  BadgeCheck,
  BadgeX,
  Check,
  ChevronDown,
  FileText,
  Send,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

const possibleStatuses = [
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
] as const;

const statusColors: Record<string, string> = {
  applied:
    "bg-sky-100 text-sky-500 hover:bg-sky-200 hover:text-sky-600 border border-sky-300 dark:hover:bg-sky-800/50 dark:hover:text-sky-300",
  assessment:
    "bg-yellow-100 text-yellow-500 hover:bg-yellow-200 hover:text-yellow-600 border border-yellow-300 dark:hover:bg-yellow-800/50 dark:hover:text-yellow-300",
  interview:
    "bg-purple-100 text-purple-500 hover:bg-purple-200 hover:text-purple-600 border border-purple-300 dark:hover:bg-purple-800/50 dark:hover:text-purple-300",
  offer:
    "bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600 border border-green-300 dark:hover:bg-green-800/50 dark:hover:text-green-300",
  rejected:
    "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 border border-red-300 dark:hover:bg-red-800/50 dark:hover:text-red-300",
};

const statusIcons: Record<string, React.ReactNode> = {
  applied: <Send className="size-4 text-sky-500" />,
  assessment: <FileText className="size-4 text-yellow-500" />,
  interview: <Users className="size-4 text-purple-500" />,
  offer: <BadgeCheck className="size-4 text-green-500" />,
  rejected: <BadgeX className="size-4 text-red-500" />,
};

interface StatusDropdownProps {
  application: PrismaApplication;
}

export default function StatusDropdown({
  application,
}: StatusDropdownProps): React.ReactElement {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleStatusChange = (newStatus: string) => {
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
              `h-auto ${statusColors[application.status.toLowerCase()]} w-full justify-center border-none px-2.5 py-0.5 text-sm font-semibold ${isPending ? "animate-pulse cursor-default" : "cursor-pointer"}`,
            )}
          >
            <div className="flex items-center justify-center gap-1">
              {statusIcons[application.status.toLowerCase()]}
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
          <div className="flex">
            {possibleStatuses.map((statusOption) => (
              <DropdownMenuItem
                inset={false}
                key={statusOption}
                disabled={isPending || application.status === statusOption}
                onSelect={() => handleStatusChange(statusOption)}
                className={`${statusColors[statusOption.toLowerCase()]} mx-1 h-7 cursor-pointer items-center rounded-lg px-2 transition-colors`}
              >
                <div className="flex flex-1 items-center justify-center gap-1">
                  {statusIcons[statusOption.toLowerCase()]}
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
