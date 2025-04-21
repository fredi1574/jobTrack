"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "./ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  const handleThemeChange = (isChecked) => {
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
            <span className="hidden text-sm text-gray-600 sm:inline dark:text-white">
              Hi, {session.user.name || session.user.email?.split("@")[0]}{" "}
            </span>

            {renderThemeToggle()}

            <Button
              variant="outline"
              size="sm"
              className="ml-4 cursor-pointer dark:bg-gray-700 dark:text-white"
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
