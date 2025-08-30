"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Header from "./Header";

const NO_HEADER_PAGES: string[] = ["/login", "/register"];

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  // FIXME: fix the pathname header issue
  const pathname = usePathname();
  const shouldHideHeader = pathname
    ? NO_HEADER_PAGES.includes(pathname)
    : false;

  return (
    <SessionProvider>
      <Toaster theme="system" duration={2000} />
      {!shouldHideHeader && <Header />}
      {children}
    </SessionProvider>
  );
}
