"use client";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  Coffee,
  DoorOpen,
  List,
  Menu,
  Moon,
  Shield,
  Sun,
  ThumbsUp,
  Users,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

const SignOutButton = () => {
  return (
    <Button
      className="w-full bg-red-400 p-6 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600"
      onClick={() => signOut({ callbackUrl: "/" })}
      variant={undefined}
      size={undefined}
    >
      <div className="flex items-center gap-2">
        <DoorOpen />
        Sign out
      </div>
    </Button>
  );
};

export default function Header() {
  const { data: session } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDarkMode = resolvedTheme === "dark";

  const renderThemeToggle = () => {
    return (
      <Button
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        aria-label="Toggle theme"
        className="w-full bg-slate-300 p-6 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
        variant={undefined}
        size={undefined}
      >
        <div className="flex items-center gap-2">
          <Sun className="h-6 w-6 scale-100 fill-yellow-500 transition-all duration-500 dark:scale-0" />
          <Moon className="absolute h-6 w-6 scale-0 rotate-90 transform fill-blue-200 transition-all duration-500 dark:scale-100 dark:rotate-45" />
          <span>Toggle theme</span>
        </div>
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-end p-4 md:hidden">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        {session?.user && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-neutral-500/30"
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
        className={`bg-card absolute top-full left-0 w-full p-4 shadow-lg/20 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none opacity-0"
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
                <Link href="/contacts">
                  <Users className="mr-2 size-4" />
                  Contacts
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
                className="w-full bg-slate-300 p-6 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                onClick={() => setIsMenuOpen(false)}
                size={undefined}
              >
                <Link href="/recommendations">
                  <ThumbsUp className="mr-2 size-4" />
                  AI Recommendations
                </Link>
              </Button>

              <Button
                variant="ghost"
                asChild
                className="w-full bg-slate-300 p-6 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                onClick={() => setIsMenuOpen(false)}
                size={undefined}
              >
                <Link href="/support">
                  <Coffee className="size-4" />
                  Support
                </Link>
              </Button>

              <Button
                variant="ghost"
                asChild
                className="w-full bg-slate-300 p-6 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                onClick={() => setIsMenuOpen(false)}
                size={undefined}
              >
                <Link href="/privacy">
                  <Shield className="size-4" />
                  Privacy
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
