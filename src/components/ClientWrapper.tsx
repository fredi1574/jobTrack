"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import HeaderWrapper from "./HeaderWrapper";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <SessionProvider>
      <Toaster theme="system" duration={2000} />
      <HeaderWrapper />
      {children}
    </SessionProvider>
  );
}
