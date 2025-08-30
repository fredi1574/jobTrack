import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import AddApplicationForm from "./AddApplicationForm";
import { useState } from "react";

interface AddApplicationModalProps {
  onAddSuccess: () => void;
}

export default function AddApplicationModal({
  onAddSuccess,
}: AddApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    onAddSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-500/70 text-green-900 hover:bg-green-700 dark:text-white"
          variant={undefined}
          size={undefined}
        >
          <PlusCircle className="h-4 w-4" />
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-y-auto sm:max-h-[90vh] sm:max-w-lg">
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Add new Application</DialogTitle>
          <DialogDescription className={undefined}>
            Fill in the details for the job application you are applying for
          </DialogDescription>
        </DialogHeader>

        <AddApplicationForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
