"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export const ActiveLink = (props: { href: string; children: ReactNode }) => {
  const pathname = usePathname();
  return (
    <Link
      href={props.href}
      className={cn(
        "px-4 py-2 rounded-[18px] whitespace-nowrap flex items-center gap-2 text-sm transition-all",
        pathname === props.href && "bg-primary text-primary-foreground",
      )}
    >
      {props.children}
    </Link>
  );
};
