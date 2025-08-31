"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";

const NO_HEADER_PAGES_ALWAYS_HIDE: string[] = ["/login", "/register"];

export default function HeaderWrapper() {
  const pathname = usePathname();
  const { data: session } = useSession();

  let shouldHideHeader = false;

  if (NO_HEADER_PAGES_ALWAYS_HIDE.includes(pathname)) {
    shouldHideHeader = true;
  } else if (pathname === "/") {
    // Hide header on landing page only if user is not logged in
    shouldHideHeader = !session;
  }

  return <>{!shouldHideHeader && <Header />}</>;
}
