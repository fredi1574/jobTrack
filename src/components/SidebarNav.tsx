"use client";
import { ChartLine, List, ThumbsUp, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    icon: <List className="size-4" />,
    text: "Applications",
  },
  {
    href: "/contacts",
    icon: <Users className="size-4" />,
    text: "Contacts",
  },
  {
    href: "/statistics",
    icon: <ChartLine className="size-4" />,
    text: "Statistics",
  },
  {
    href: "/recommendations",
    icon: <ThumbsUp className="size-4" />,
    text: "AI Recommendations",
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              isActive
                ? "bg-gray-200/70 dark:bg-gray-800"
                : "hover:bg-gray-200/70 dark:hover:bg-gray-800"
            }`}
          >
            {link.icon}
            {link.text}
          </Link>
        );
      })}
    </nav>
  );
}
