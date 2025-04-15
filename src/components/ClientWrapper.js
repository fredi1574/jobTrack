"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "./Header";

const NO_HEADER_PAGES = ["/login", "/register"];

export default function ClientWrapper({ children }) {
  const pathname = usePathname;
  const shouldHideHeader = NO_HEADER_PAGES.includes(pathname);

  return (
    <SessionProvider>
      {!shouldHideHeader && <Header />}
      {children}
    </SessionProvider>
  );
}
