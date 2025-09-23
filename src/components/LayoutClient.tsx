"use client";
import MobileHeader from "@/components/header/MobileHeader";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

interface LayoutClientProps {
  children: React.ReactNode;
}

const NO_SIDEBAR_PAGES: string[] = ["/login", "/register"];

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const shouldShowSidebar = session && !NO_SIDEBAR_PAGES.includes(pathname);

  if (pathname === "/" && !session) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      {shouldShowSidebar && <Sidebar />}
      <main className="flex-1">
        <MobileHeader />
        {children}
      </main>
    </div>
  );
}
