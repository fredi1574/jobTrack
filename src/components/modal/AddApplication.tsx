"use client";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import AddApplicationModal from "./AddApplicationModal";

export default function AddApplication() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-500/70 text-green-900 hover:bg-green-600 dark:text-white"
          variant={undefined}
          size={undefined}
        >
          <PlusCircle className="h-4 w-4" />
          Add Application
        </Button>
      </DialogTrigger>
      <AddApplicationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Dialog>
  );
}
