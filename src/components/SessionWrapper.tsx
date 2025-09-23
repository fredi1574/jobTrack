"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

interface SessionWrapperProps {
  children: React.ReactNode;
}

export default function SessionWrapper({ children }: SessionWrapperProps) {
  return (
    <SessionProvider>
      <Toaster theme="system" duration={2000} />
      {children}
    </SessionProvider>
  );
}
