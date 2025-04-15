"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between bg-white p-4 text-gray-900 shadow-md dark:bg-gray-800 dark:text-white">
      <Link href="/" className="text-xl font-bold">
        JobTracker
      </Link>

      <nav className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="h-6 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
        ) : session?.user ? (
          <>
            <span className="hidden text-sm text-gray-600 sm:inline dark:text-gray-400">
              Hi, {session.user.name || session.user.email?.split("@")[0]}{" "}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </Button>
          </>
        ) : null}
      </nav>
    </header>
  );
}
