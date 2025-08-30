import { PlusCircle } from "lucide-react";
import { useState } from "react";
import AddApplicationForm from "./AddApplicationForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function AddApplicationModal() {
  const [isOpen, setIsOpen] = useState(false);

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

        <AddApplicationForm setModalOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
