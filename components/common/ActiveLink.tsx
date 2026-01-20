"use client";

import { ActiveLinkProps } from "@/app/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const AnimatedIcon = ({
  icon,
  active,
}: {
  icon: React.ReactNode;
  active: boolean;
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (active) {
      setShow(false);
      const timeout = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(timeout);
    }
  }, [active]);

  return (
    <span
      className={`
        inline-flex
        transition-all duration-300 ease-out
        ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-90"}
        ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}
      `}
    >
      {icon}
    </span>
  );
};

const ActiveLink = ({ item }: ActiveLinkProps) => {
  const path = usePathname();
  const active = item.href === path;

  return (
    <Link
      key={item.href}
      href={item.href}
      scroll={false}
      className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all duration-300 ease-out
        ${active
          ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/15 dark:from-indigo-500/20 dark:to-purple-500/20 shadow-md shadow-indigo-200/50 dark:shadow-indigo-900/30 font-semibold text-foreground scale-[1.02]"
          : "text-muted-foreground hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-sm hover:scale-[1.01]"
        }
      `}
    >
      {/* Active indicator bar */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full shadow-lg shadow-indigo-500/50" />
      )}

      {/* Icon */}
      <AnimatedIcon icon={item.icon} active={active} />

      {/* Label */}
      <span
        className={`
          transition-all duration-300
          ${active
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold"
            : "group-hover:text-foreground"
          }
        `}
      >
        {item.label}
      </span>

      {/* Hover glow effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10
        pointer-events-none
        ${active ? 'opacity-100' : ''}
      `} />
    </Link>
  );
};

export default ActiveLink;
