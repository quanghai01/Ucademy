import { getUserInfo } from "@/app/lib/actions/user.actions";
import PageNotFound from "@/app/not-found";
import { EUserRole } from "@/app/types/enums";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session?.userId) {
    redirect("/sign-in");
  }

  const user = await getUserInfo({ clerkId: session.userId });
  if (user && user.role !== EUserRole.ADMIN) return <PageNotFound />;

  if (!user) {
    redirect("/sign-in");
  }

  return <div>{children}</div>;
};

export default AdminLayout;
