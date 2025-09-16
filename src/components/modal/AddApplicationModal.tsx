import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddApplicationForm from "./AddApplicationForm";
import { Application } from "@prisma/client";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<Application> | null;
}

export default function AddApplicationModal({
  isOpen,
  onClose,
  initialData,
}: AddApplicationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-auto rounded-r-none">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Add new Application</DialogTitle>
          <DialogDescription className={undefined}>
            Fill in the details for the job application you are applying for
          </DialogDescription>
        </DialogHeader>

        <AddApplicationForm onSuccess={onClose} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
}
