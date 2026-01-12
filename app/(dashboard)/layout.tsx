import Sidebar from "@/components/layout/Sidebar";
import React from "react";
import { connectToDatabase } from "../lib/mongoose";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="wrapper grid grid-cols-[300px,1fr] md:grid-cols-[250px,1fr] sm:grid-cols-1 relative z-10">
      <Sidebar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default layout;
