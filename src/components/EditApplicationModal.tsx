import { Application as PrismaApplication } from "@prisma/client";
import EditApplicationForm from "./EditApplicationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationData: PrismaApplication | null;
}

export default function EditApplicationModal({
  isOpen,
  onClose,
  applicationData,
}: EditApplicationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-y-auto rounded-r-none sm:max-h-[90vh] sm:max-w-lg">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Edit Application</DialogTitle>
          <DialogDescription className={undefined}>
            Update the details for this job application
          </DialogDescription>
        </DialogHeader>

        {applicationData && (
          <EditApplicationForm
            applicationData={applicationData}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
