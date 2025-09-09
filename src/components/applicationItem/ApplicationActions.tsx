import { toggleApplicationPin } from "@/app/actions/application";
import DeleteApplicationModal from "@/components/modal/DeleteApplicationModal";
import { Application as PrismaApplication } from "@prisma/client";
import { Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ApplicationActionsProps {
  application: PrismaApplication;
  onEdit: (application: PrismaApplication) => void;
}

export default function ApplicationActions({
  application,
  onEdit,
}: ApplicationActionsProps): React.ReactElement {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationToDeleteId, setApplicationToDeleteId] = useState<
    string | null
  >(null);
  const [isHoveringPin, setIsHoveringPin] = useState(false);

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(application);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setApplicationToDeleteId(application.id);
    setIsDeleteModalOpen(true);
  };

  const handlePinClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const result = await toggleApplicationPin(
      application.id,
      application.pinned,
    );
    if (result.success) {
      toast.success(
        application.pinned ? "Application unpinned" : "Application pinned",
      );
    } else {
      toast.error(result.error);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setApplicationToDeleteId(null);
  };

  return (
    <div className="hidden shrink-0 items-center gap-2 pl-1 sm:gap-3 sm:pl-2 md:flex">
      <div
        onMouseEnter={() => setIsHoveringPin(true)}
        onMouseLeave={() => setIsHoveringPin(false)}
      >
        {application.pinned && isHoveringPin ? (
          <PinOff
            onClick={handlePinClick}
            className="size-4 cursor-pointer text-blue-400 dark:hover:text-blue-400"
            aria-label="Unpin Application"
          />
        ) : (
          <Pin
            onClick={handlePinClick}
            className={`size-4 cursor-pointer ${
              application.pinned
                ? "fill-blue-400 text-blue-400"
                : "text-gray-500"
            } hover:text-blue-600 dark:hover:text-blue-400`}
            aria-label="Pin Application"
          />
        )}
      </div>
      <Pencil
        onClick={handleEditClick}
        className="size-4 cursor-pointer text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400"
        aria-label="Edit Application"
      />
      <Trash2
        onClick={handleDeleteClick}
        className="size-4 cursor-pointer text-gray-500 hover:text-red-600 dark:hover:text-red-400"
        aria-label="Delete Application"
      />
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
