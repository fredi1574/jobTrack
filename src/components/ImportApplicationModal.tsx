import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { CSVImportForm } from "./CSVImportForm";
import { useState } from "react";

interface ImportApplicationModalProps {
  onImportSuccess: () => void;
}

export default function ImportApplicationModal({
  onImportSuccess,
}: ImportApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    onImportSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={undefined} size={undefined}>
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className={undefined}>
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Import from CSV</DialogTitle>
        </DialogHeader>
        <CSVImportForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
