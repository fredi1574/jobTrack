import Contacts from "@/components/Contacts";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

async function getContacts() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return [];
  }

  const contacts = await prisma.contact.findMany({
    where: {
      userId: session.user?.id,
    },
  });

  return contacts;
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return <Contacts initialContacts={contacts} />;
}
