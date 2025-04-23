"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import React from "react";

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
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {!shouldHideHeader && <Header />}
      {children}
    </SessionProvider>
  );
}
