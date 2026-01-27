"use client";
import React from "react";

import {
  Home,
  Users,
  MessageCircle,
  Receipt,
  GraduationCap,
  LibraryBig,
  LogIn,
  Sparkles,
  Star
} from "lucide-react";

import ActiveLink from "../common/ActiveLink";
import { useAuth, UserButton } from "@clerk/nextjs";


import Link from "next/link";
import { ModeToggle } from "../modeToggle/ModeToggle";

const Sidebar = () => {
  const menuItems = [
    {
      label: "Trang chủ",
      href: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Vào học",
      href: "/study",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      label: "Khóa học",
      href: "/manage/course",
      icon: <LibraryBig className="w-5 h-5" />,
    },
    {
      label: "Thành viên",
      href: "/manage/member",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Đơn hàng",
      href: "/manage/order",
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      label: "Bình luận",
      href: "/manage/comment",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      label: "Đánh giá",
      href: "/manage/rating",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  const { userId, isLoaded } = useAuth();

  return (
    <aside
      className="sticky top-0 left-0 z-40 w-64 xl:w-72 flex-shrink-0
                 bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/20 dark:from-gray-900 dark:via-indigo-950/20 dark:to-purple-950/10 
                 border-r border-indigo-100 dark:border-gray-800 text-card-foreground p-6 flex flex-col
                 h-screen overflow-y-auto
                 backdrop-blur-xl shadow-xl"
    >

      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10" />


      <div className="mb-8 group cursor-pointer">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold tracking-tight">
            Ucademy
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-12 opacity-0 group-hover:opacity-100 transition-opacity">
          Học để phát triển
        </p>
      </div>


      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item, index) => (
          <ActiveLink key={index} item={item} />
        ))}
      </nav>


      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800 to-transparent my-4" />


      <div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-indigo-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        {isLoaded && userId ? (
          <div className="flex items-center gap-3">
            <UserButton />
            <span className="text-sm font-medium hidden xl:inline">Tài khoản</span>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden xl:inline">Đăng nhập</span>
          </Link>
        )}

        <ModeToggle />
      </div>


      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground font-medium">
          © 2026 <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">Ucademy</span>
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          Tạo ra bằng ❤️ cho người học
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
