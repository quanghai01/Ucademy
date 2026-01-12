"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  return <div>{children}</div>;
};

export default AdminLayout;
