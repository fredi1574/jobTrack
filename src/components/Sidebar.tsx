"use client";
import { Coffee, DoorClosed, DoorOpen, Moon, Shield, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { Button } from "./ui/button";

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
      className="flex w-full items-center gap-2 rounded-md bg-red-400 px-3 py-2 text-sm font-medium hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600"
      onClick={() => signOut({ callbackUrl: "/" })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variant={undefined}
      size={undefined}
    >
      {hovered ? <DoorOpen /> : <DoorClosed />}
      Sign out
    </Button>
  );
};

export default function Sidebar() {
  const { data: session, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  const renderThemeToggle = () => {
    return (
      <Button
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        aria-label="Toggle theme"
        className="hover:bg-accent justify-start border-none bg-transparent text-black dark:text-white"
        variant={undefined}
        size={undefined}
      >
        {isDarkMode ? (
          <Moon className="size-4 fill-blue-200" />
        ) : (
          <Sun className="size-4 fill-yellow-500" />
        )}
        <span>Toggle theme</span>
      </Button>
    );
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white p-4 md:flex dark:border-gray-800 dark:bg-neutral-900">
      <div className="flex items-center gap-2">
        <p className="w-full text-center text-2xl font-bold tracking-tight">
          JobTrack
        </p>
      </div>
      <div className="mt-4">
        {status === "loading" ? (
          <div className="h-8 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700"></div>
        ) : session?.user ? (
          <p className="rounded-full bg-gray-300/50 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
            Hi, {session.user.name || session.user.email?.split("@")[0]}
          </p>
        ) : null}
      </div>
      <div className="mt-8 flex-grow">
        <SidebarNav />
      </div>
      <div className="flex flex-col gap-2">
        <Link
          href="/support"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200/70 dark:hover:bg-gray-800"
        >
          <Coffee className="size-4" />
          Support
        </Link>
        <Link
          href="/privacy"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200/70 dark:hover:bg-gray-800"
        >
          <Shield className="size-4" />
          Privacy
        </Link>
        {renderThemeToggle()}
        <SignOutButton />
      </div>
    </aside>
  );
}
