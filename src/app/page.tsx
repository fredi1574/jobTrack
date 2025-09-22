import DashboardClient from "@/components/DashboardClient";
import LandingPage from "@/components/landing/LandingPage";
import { getServerAuthSession } from "@/lib/auth";
import type { Session } from "next-auth";
import { getApplications } from "./actions/application";

export default async function HomePage() {
  const session: Session | null = await getServerAuthSession();
  const userId = session?.user?.id;

  // *** Logged-in View (Dashboard) ***
  if (userId) {
    const applications = await getApplications(userId);

    return <DashboardClient initialApplications={applications} />;
  }

  // *** Logged-out View (Landing) ***
  else {
    return <LandingPage />;
  }
}
