"use client";
import {
  addContact,
  deleteContact,
  updateContact,
} from "@/app/actions/contact";
import ContactList from "@/components/contacts/ContactList";
import ContactTable from "@/components/contacts/ContactTable";
import AddContactModal from "@/components/modal/AddContactModal";
import DeleteContactModal from "@/components/modal/DeleteContactModal";
import EditContactModal from "@/components/modal/EditContactModal";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/types/contact";
import { Contact } from "@prisma/client";
import { List, Plus, Table } from "lucide-react";
import { useState, useTransition } from "react";

export default function Contacts({
  initialContacts,
}: {
  initialContacts: Contact[];
}) {
  const [isPending, startTransition] = useTransition();
  const [contacts, setContacts] = useState(initialContacts);
  const [view, setView] = useState("card");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleAddContact = async (contact: ContactForm) => {
    startTransition(async () => {
      const result = await addContact(contact);
      if (result.success && result.contact) {
        setContacts((prevContacts) => [...prevContacts, result.contact!]);
        setIsAddModalOpen(false);
      }
    });
  };

  const handleEditContact = async (id: string, contact: ContactForm) => {
    startTransition(async () => {
      const result = await updateContact(id, contact);
      if (result.success && result.contact) {
        setContacts((prevContacts) =>
          prevContacts.map((c) => (c.id === id ? result.contact! : c)),
        );
        setIsEditModalOpen(false);
        setSelectedContact(null);
      }
    });
  };

  const handleDeleteContact = async (id: string) => {
    startTransition(async () => {
      const result = await deleteContact(id);
      if (result.success) {
        setContacts((prevContacts) => prevContacts.filter((c) => c.id !== id));
        setIsDeleteModalOpen(false);
        setSelectedContact(null);
      }
    });
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "card" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setView("card")}
            className={undefined}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setView("table")}
            className={undefined}
          >
            <Table className="h-4 w-4" />
          </Button>
          <AddContactModal
            onAddContact={handleAddContact}
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
          >
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className={undefined}
              variant={undefined}
              size={undefined}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </AddContactModal>
        </div>
      </div>
      {view === "card" ? (
        <ContactList
          contacts={contacts}
          onEditContact={openEditModal}
          onDeleteContact={openDeleteModal}
        />
      ) : (
        <ContactTable
          contacts={contacts}
          onEditContact={openEditModal}
          onDeleteContact={openDeleteModal}
        />
      )}

      {selectedContact && (
        <EditContactModal
          contact={selectedContact}
          onEditContact={handleEditContact}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        >
          <></>
        </EditContactModal>
      )}

      {selectedContact && (
        <DeleteContactModal
          onDeleteContact={() => handleDeleteContact(selectedContact.id)}
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <></>
        </DeleteContactModal>
      )}
    </div>
  );
}
