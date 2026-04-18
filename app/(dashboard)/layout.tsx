import Sidebar from "@/components/layout/Sidebar";
import { PreventScrollLock } from "@/components/common/PreventScrollLock";
import React from "react";
import { getRole } from "../lib/auth";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const role = await getRole();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-950 dark:to-indigo-950/20">
      <PreventScrollLock />
      <div className="max-w-[1440px] mx-auto flex w-full">
        <Sidebar role={role} />
        <main className="flex-1 min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default layout;
