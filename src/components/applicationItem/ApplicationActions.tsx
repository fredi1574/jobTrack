import DeleteApplicationModal from "@/components/modal/DeleteApplicationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Application as PrismaApplication } from "@prisma/client";
import { MoreHorizontal, Pencil, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

interface ApplicationActionsProps {
  application: PrismaApplication;
  onEdit: (application: PrismaApplication) => void;
  onAddToCalendar: (event: React.MouseEvent) => void;
  onSalaryEstimation: (application: PrismaApplication) => void;
}

export default function ApplicationActions({
  application,
  onEdit,
  onAddToCalendar,
  onSalaryEstimation,
}: ApplicationActionsProps): React.ReactElement {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationToDeleteId, setApplicationToDeleteId] = useState<
    string | null
  >(null);

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(application);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setApplicationToDeleteId(application.id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setApplicationToDeleteId(null);
  };

  return (
    <div className="hidden shrink-0 items-center gap-2 pl-1 sm:gap-3 sm:pl-2 md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
            className="flex cursor-pointer items-center justify-center"
          >
            <MoreHorizontal className="hover:bg-accent-foreground/10 size-4 rounded-full transition-colors" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(event: React.MouseEvent) => event.stopPropagation()}
          className={undefined}
        >
          <DropdownMenuItem
            onClick={handleEditClick}
            className={undefined}
            inset={undefined}
          >
            <Pencil className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSalaryEstimation(application)}
            className={undefined}
            inset={undefined}
          >
            <Sparkles className="mr-2 size-4" />
            AI Salary Estimation
          </DropdownMenuItem>
          {/* Temporarily disabled until verified */}
          {/* {application.status === "Interview" && application.interviewDate && (
            <DropdownMenuItem
              onClick={onAddToCalendar}
              className={undefined}
              inset={undefined}
            >
              <CalendarPlus className="mr-2 size-4" />
              Add to Calendar
            </DropdownMenuItem>
          )} */}
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-500"
            inset={undefined}
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {applicationToDeleteId && (
        <DeleteApplicationModal
          applicationId={applicationToDeleteId}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
        />
      )}
    </div>
  );
}
