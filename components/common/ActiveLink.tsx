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
        transition-all duration-300 ease-in-out
        transition-colors duration-500 ease-linear
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        ${active ? "text-indigo-500" : "text-gray-400 dark:text-gray-500"}
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
        flex items-center gap-3 px-3 py-2 rounded-md
        transition-colors duration-200
        hover:bg-primary/10
        ${
          active
            ? "bg-primary/10 font-medium text-foreground"
            : "text-muted-foreground"
        }
      `}
    >
      <AnimatedIcon icon={item.icon} active={active} />
      <span
        className={
          active ? "text-gradient-primary text-transparent bg-clip-text" : ""
        }
      >
        {item.label}
      </span>
    </Link>
  );
};

export default ActiveLink;
