import React from "react";

import {
  Home,
  Users,
  MessageCircle,
  Receipt,
  GraduationCap,
  LibraryBig,
} from "lucide-react";

import ActiveLink from "../common/ActiveLink";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../modeToggle/ModeToggle";
const Sidebar = () => {
  const menuItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Study",
      href: "/study",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      label: "Courses",
      href: "/manage/courses",
      icon: <LibraryBig className="w-5 h-5" />,
    },
    {
      label: "Member",
      href: "/manage/member",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Order",
      href: "/manage/order",
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      label: "Comment",
      href: "/manage/comment",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className="bg-card border-r border-border text-card-foreground p-4 flex flex-col bg-accent
                   md:h-screen md:min-h-screen h-auto max-h-[100vh] overflow-y-auto"
    >
      <div className="mb-6 text-lg font-bold">
        <span className="text-primary text-2xl">U</span>
        cademy
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item, index) => (
          <ActiveLink key={index} item={item} />
        ))}
      </nav>
      <div className="p-3 flex items-center justify-between">
        <UserButton />
        <ModeToggle />
      </div>
      <div className="mt-auto text-sm text-muted-foreground">
        © 2026 Ucademy
      </div>
    </aside>
  );
};

export default Sidebar;
