"use client";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  Coffee,
  DoorClosed,
  DoorOpen,
  List,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

const SignOutButton = () => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <Button
      variant="default"
      size="sm"
      className="w-full bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600"
      onClick={() => signOut({ callbackUrl: "/" })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hovered ? <DoorOpen /> : <DoorClosed />}
      Sign out
    </Button>
  );
};

export default function Header() {
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  const renderThemeToggle = () => {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        aria-label="Toggle theme"
        className={undefined}
      >
        <Sun className="h-6 w-6 scale-100 rotate-0 transform transition-all duration-500 dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-6 w-6 scale-0 rotate-90 transform transition-all duration-500 dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-white/30 to-white/10 p-4 shadow-lg/20 backdrop-blur-md transition-all duration-1500 ease-in-out dark:from-gray-800/50 dark:to-gray-800/30 dark:text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          JobTracker
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-6 md:flex">
          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-gray-300 dark:bg-gray-700"></div>
          ) : session?.user ? (
            <>
              <p className="rounded-full bg-gray-300/50 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                Hi, {session.user.name || session.user.email?.split("@")[0]}
              </p>
              <Button
                variant="ghost"
                asChild
                className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                size={undefined}
              >
                <Link href="/">
                  <List className="mr-2 size-4" />
                  Table
                </Link>
              </Button>
              <Button
                variant="ghost"
                asChild
                className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                size={undefined}
              >
                <Link href="/statistics">
                  <ChartLine className="mr-2 size-4" />
                  Statistics
                </Link>
              </Button>

              <Button
                variant="ghost"
                asChild
                className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                size={undefined}
              >
                <Link href="/support">
                  <Coffee className="size-4" />
                  Support
                </Link>
              </Button>

              {renderThemeToggle()}

              <div>
                <SignOutButton />
              </div>
            </>
          ) : null}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {session?.user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-500/30"
            >
              {isMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white p-4 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out md:hidden dark:bg-gray-800 ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-4">
          {session?.user && (
            <>
              <Button
                variant="ghost"
                className="w-full bg-slate-300 p-6 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                asChild
                onClick={() => setIsMenuOpen(false)}
                size={undefined}
              >
                <Link href="/">
                  <List className="mr-2 size-4" />
                  Table
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full bg-slate-300 p-6 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                asChild
                onClick={() => setIsMenuOpen(false)}
                size={undefined}
              >
                <Link href="/statistics">
                  <ChartLine className="mr-2 size-4" />
                  Statistics
                </Link>
              </Button>

              <Button
                variant="ghost"
                asChild
                className="bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                size={undefined}
              >
                <Link href="/support">
                  <Coffee className="size-4" />
                  Support
                </Link>
              </Button>

              <div className="my-2">{renderThemeToggle()}</div>

              <div className="w-full">
                <SignOutButton />
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
