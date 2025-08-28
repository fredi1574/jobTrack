"use client";
import { Button } from "@/components/ui/button";
import { ChartLine, List, Menu, Moon, Sun, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";

export default function Header() {
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          className={`size-5 transition-colors ${
            isDarkMode ? "text-orange-400/40" : "text-orange-400"
          }`}
        />
        <Switch
          className=""
          id="theme-switch"
          checked={isDarkMode}
          onCheckedChange={handleThemeChange}
          aria-label="Toggle theme"
        />
        <Moon
          className={`size-5 transition-colors ${
            isDarkMode ? "text-blue-400" : "text-blue-400/40"
          }`}
        />
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 p-4 text-gray-900 shadow-md backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 dark:text-white">
      <Link href="/" className="text-xl font-bold">
        JobTracker
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden items-center gap-4 md:flex">
        {status === "loading" ? (
          <div className="h-6 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
        ) : session?.user ? (
          <>
            <p className="rounded-md bg-gray-200 p-2 text-sm text-gray-600 dark:bg-gray-600 dark:text-white">
              Hi, {session.user.name || session.user.email?.split("@")[0]}{" "}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="dark:bg-gray-700 dark:text-white"
              asChild
            >
              <Link href="/">
                <List className="mr-2 size-4" />
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
                <ChartLine className="mr-2 size-4" />
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

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        {session?.user && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={undefined}
          >
            {isMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white p-4 shadow-md transition-all duration-300 ease-in-out md:hidden dark:bg-gray-800 ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-4">
          {session?.user && (
            <>
              <p className="rounded-md bg-gray-200 p-2 text-sm text-gray-600 dark:bg-gray-600 dark:text-white">
                Hi,{" "}
                {session.user.name || session.user.email?.split("@")[0]}{" "}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full dark:bg-gray-700 dark:text-white"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/">
                  <List className="mr-2 size-4" />
                  Table
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full dark:bg-gray-700 dark:text-white"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/analytics">
                  <ChartLine className="mr-2 size-4" />
                  Statistics
                </Link>
              </Button>

              {renderThemeToggle()}

              <Button
                variant="destructive"
                size="sm"
                className="w-full cursor-pointer hover:bg-red-500 dark:text-white dark:hover:bg-red-700"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsMenuOpen(false);
                }}
              >
                Sign out
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
