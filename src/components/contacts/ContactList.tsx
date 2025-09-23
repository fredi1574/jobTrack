import { Button } from "@/components/ui/button";
import { Contact } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";

interface ContactListProps {
  contacts: Contact[];
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
}

export default function ContactList({
  contacts,
  onEditContact,
  onDeleteContact,
}: ContactListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-card rounded-lg border p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{contact.name}</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditContact(contact)}
                className={undefined}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteContact(contact)}
                className={undefined}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {contact.company} - {contact.position}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {contact.email}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {contact.phone}
          </p>
          <p className="mt-2">{contact.notes}</p>
        </div>
      ))}
    </div>
  );
}
