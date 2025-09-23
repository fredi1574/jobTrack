"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteContactModalProps {
  onDeleteContact: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteContactModal({
  onDeleteContact,
  open,
  onOpenChange,
}: DeleteContactModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={undefined}>
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>
            Are you sure you want to delete this contact?
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className={undefined}
            size={undefined}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDeleteContact}
            className={undefined}
            size={undefined}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
