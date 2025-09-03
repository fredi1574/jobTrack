"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { DialogClose } from "./ui/dialog";
import { Loader } from "lucide-react";

interface SubmitButtonProps {
  text: string;
  pendingText: string;
  icon: React.ReactNode;
}

export function SubmitButton({ text, pendingText, icon }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      size="sm"
      variant="outline"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full bg-green-500 transition-colors hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
    >
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </Button>
  );
}

export function CancelButton() {
  return (
    <DialogClose asChild>
      <Button
        size="sm"
        variant="outline"
        type="button"
        className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
      >
        Cancel
      </Button>
    </DialogClose>
  );
}
