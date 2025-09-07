import { deleteApplication } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteApplicationModalProps {
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteApplicationModal({
  applicationId,
  isOpen,
  onClose,
}: DeleteApplicationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteApplication(applicationId);
      toast.success("Application deleted successfully.");
      onClose();
    } catch (error) {
      toast.error("Failed to delete application.");
      console.error("Failed to delete application:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Confirm Deletion</DialogTitle>
          <DialogDescription className={undefined}>
            Are you sure you want to delete this application? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={undefined}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className={undefined}
            size={undefined}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className={undefined}
            size={undefined}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
