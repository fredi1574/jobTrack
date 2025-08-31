import StatisticsClient from "@/components/statistics/StatisticsClient";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import { Session } from "next-auth";
import Link from "next/link";
import { getApplications } from "../actions";

export default async function Statistics() {
  const session: Session | null = await getServerAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
          You must be logged in to view this page.
        </h1>
        <Button
          asChild
          className={undefined}
          variant={undefined}
          size={undefined}
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  const applications = await getApplications(userId);

  return <StatisticsClient initialApplications={applications} />;
}
