"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactForm } from "@/types/contact";
import { useState } from "react";

interface AddContactModalProps {
  onAddContact: (contact: ContactForm) => void;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddContactModal({
  onAddContact,
  children,
  open,
  onOpenChange,
}: AddContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddContact({ name, email, phone, notes, company, position });
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setCompany("");
    setPosition("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={undefined}>
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Add a new contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="John Doe"
              required
              className={undefined}
              type={undefined}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="john.doe@example.com"
              className={undefined}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone
            </label>
            <Input
              id="phone"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              placeholder="+972-50-123-4567"
              className={undefined}
              type={undefined}
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Company
            </label>
            <Input
              id="company"
              value={company}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCompany(e.target.value)
              }
              placeholder="Google"
              className={undefined}
              type={undefined}
            />
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Position
            </label>
            <Input
              id="position"
              value={position}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPosition(e.target.value)
              }
              placeholder="Software Engineer"
              className={undefined}
              type={undefined}
            />
          </div>
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              placeholder="Notes about the contact"
              className={undefined}
            />
          </div>
          <Button
            type="submit"
            className={undefined}
            variant={undefined}
            size={undefined}
          >
            Add Contact
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
