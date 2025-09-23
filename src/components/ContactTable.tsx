import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contact } from "@prisma/client";
import { Pencil, Trash } from "lucide-react";

interface ContactTableProps {
  contacts: Contact[];
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
}

export default function ContactTable({
  contacts,
  onEditContact,
  onDeleteContact,
}: ContactTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="bg-card">
        <TableHeader className="">
          <TableRow className={undefined}>
            <TableHead className={undefined}>Name</TableHead>
            <TableHead className={undefined}>Company</TableHead>
            <TableHead className={undefined}>Position</TableHead>
            <TableHead className={undefined}>Email</TableHead>
            <TableHead className={undefined}>Phone</TableHead>
            <TableHead className={undefined}>Notes</TableHead>
            <TableHead className={undefined}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={undefined}>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <TableCell className={undefined}>{contact.name}</TableCell>
              <TableCell className={undefined}>{contact.company}</TableCell>
              <TableCell className={undefined}>{contact.position}</TableCell>
              <TableCell className={undefined}>{contact.email}</TableCell>
              <TableCell className={undefined}>{contact.phone}</TableCell>
              <TableCell className={undefined}>{contact.notes}</TableCell>
              <TableCell className="flex gap-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
