import DashboardClient from "@/components/DashboardClient";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getApplications(userId) {
  if (!userId) return [];
  try {
    const applications = await prisma.application.findMany({
      where: { UserId: userId },
      orderBy: { appliedAt: "desc" },
    });
    return applications;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return [];
  }
}

export default async function HomePage() {
  const session = await getServerAuthSession();
  const userId = session?.user?.id;

  // *** Logged-in View (Dashboard) ***
  if (userId) {
    const applications = await getApplications(userId);

    return <DashboardClient initialApplications={applications} />;
  }

  // *** Logged-out View (Welcome/Landing) ***
  else {
    return (
      <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center p-8 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Welcome to JobTracker
        </h1>
        <p className="mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Your personal assistant for managing job applications. Keep track of
          companies, positions, statuses, and more, all in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    );
  }
}
