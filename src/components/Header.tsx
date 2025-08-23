"use client";
import { Button } from "@/components/ui/button";
import { ChartLine, List, Moon, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";

export default function Header() {
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  const handleThemeChange = (isChecked: boolean) => {
    setTheme(isChecked ? "dark" : "light");
  };

  const renderThemeToggle = () => {
    if (!mounted) {
      return (
        <div className="h-6 w-[52px] animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Sun
          className={`size-5 transition-colors ${isDarkMode ? "text-orange-400/40" : "text-orange-400"}`}
        />
        <Switch
          className=""
          id="theme-switch"
          checked={isDarkMode}
          onCheckedChange={handleThemeChange}
          aria-label="Toggle theme"
        />
        <Moon
          className={`size-5 transition-colors ${isDarkMode ? "text-blue-400" : "text-blue-400/40"}`}
        />
      </div>
    );
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 text-gray-900 shadow-md dark:bg-gray-500">
      <Link href="/" className="text-xl font-bold">
        JobTracker
      </Link>

      <nav className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="h-6 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
        ) : session?.user ? (
          <>
            <p className="hidden rounded-md bg-gray-200/50 p-2 text-sm text-gray-600 sm:inline dark:bg-gray-600/50 dark:text-white">
              Hi, {session.user.name || session.user.email?.split("@")[0]}{" "}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex dark:bg-gray-700 dark:text-white"
              asChild
            >
              <Link href="/">
                <List className="size-4" />
                Table
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="dark:bg-gray-700 dark:text-white"
              asChild
            >
              <Link href="/analytics">
                <ChartLine className="size-4" />
                Statistics
              </Link>
            </Button>

            {renderThemeToggle()}

            <Button
              variant="destructive"
              size="sm"
              className="cursor-pointer hover:bg-red-500 dark:text-white dark:hover:bg-red-700"
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
