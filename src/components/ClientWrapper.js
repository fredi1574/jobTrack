"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NO_HEADER_PAGES = ["/login", "/register"];

export default function ClientWrapper({ children }) {
  const pathname = usePathname;
  const shouldHideHeader = NO_HEADER_PAGES.includes(pathname);

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
