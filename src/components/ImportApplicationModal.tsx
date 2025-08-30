import { Upload } from "lucide-react";
import { useState } from "react";
import { CSVImportForm } from "./CSVImportForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function ImportApplicationModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
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
