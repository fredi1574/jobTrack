import { Application as PrismaApplication } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import EditApplicationForm from "./EditApplicationForm";

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
      <DialogContent className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-auto rounded-r-none md:max-w-3xl lg:max-w-4xl">
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
