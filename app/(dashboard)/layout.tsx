import Sidebar from "@/components/layout/Sidebar";
import { PreventScrollLock } from "@/components/common/PreventScrollLock";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-950 dark:to-indigo-950/20">
      <PreventScrollLock />
      <div className="max-w-[1440px] mx-auto flex w-full">
        <Sidebar />
        <main className="flex-1 min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default layout;
