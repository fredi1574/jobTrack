import { updateApplicationStatus } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Application as PrismaApplication } from "@prisma/client";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-toastify";

type ApplicationStatus =
  | "Applied"
  | "Assessment"
  | "Interview"
  | "Offer"
  | "Rejected";
const possibleStatuses: ApplicationStatus[] = [
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
];

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
      className="mt-1 w-auto sm:mt-0 sm:w-1/6"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={`h-auto ${statusColors[application.status.toLowerCase()]} w-full justify-center border-none px-2.5 py-0.5 text-sm font-semibold ${isPending ? "animate-pulse cursor-default" : "cursor-pointer"}`}
          >
            {application.status}
            {isPending ? (
              <span className="ml-1 animate-spin">⏳</span>
            ) : (
              <ChevronDown className="ml-1 size-3 transition-transform group-data-[state=open]:rotate-180" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="bg-sky-50 p-2 dark:bg-indigo-950"
        >
          <div className={`flex flex-row flex-wrap`}>
            {possibleStatuses.map((statusOption) => (
              <DropdownMenuItem
                inset={true}
                key={statusOption}
                disabled={isPending || application.status === statusOption}
                onSelect={() => handleStatusChange(statusOption)}
                className={`flex items-center justify-center ${statusColors[statusOption.toLowerCase()]} mx-0.5 h-5 cursor-pointer rounded-lg px-2 transition-colors`}
              >
                <span>{statusOption}</span>
                {application.status === statusOption && (
                  <Check className="ml-2 size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
