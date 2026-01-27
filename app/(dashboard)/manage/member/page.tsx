import React from "react";
import { getAllUsers } from "@/app/lib/actions/user.actions";
import { IUser } from "@/database/user.model";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import UpdateUserStatus from "./UpdateUserStatus";
import UpdateUserRole from "./UpdateUserRole";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const ManageMemberPage = async () => {
  const users: IUser[] = await getAllUsers();

  // Calculate statistics
  const stats = {
    total: users.length,
    admin: users.filter((u: any) => u.role === "ADMIN").length,
    expert: users.filter((u: any) => u.role === "EXPERT").length,
    user: users.filter((u: any) => u.role === "USER").length,
    active: users.filter((u: any) => u.status === "ACTIVE").length,
    unactive: users.filter((u: any) => u.status === "UNACTIVE").length,
    banned: users.filter((u: any) => u.status === "BANNED").length,
  };


  const getRoleVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants = {
      ADMIN: "destructive" as const,
      EXPERT: "default" as const,
      USER: "secondary" as const,
    };
    return variants[role as keyof typeof variants] || "secondary";
  };


  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants = {
      ACTIVE: "default" as const,
      UNACTIVE: "secondary" as const,
      BANNED: "destructive" as const,
    };
    return variants[status as keyof typeof variants] || "default";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản Lý Thành Viên</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý tất cả thành viên trong hệ thống
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
        {[
          {
            label: "Tổng thành viên",
            value: stats.total,
            bg: "bg-white dark:bg-gray-800",
            text: "text-gray-600 dark:text-gray-400",
            valueText: "",
            border: "border-gray-200 dark:border-gray-700",
          },
          {
            label: "Admin",
            value: stats.admin,
            bg: "bg-red-50 dark:bg-red-900/20",
            text: "text-red-700 dark:text-red-400",
            valueText: "text-red-700 dark:text-red-400",
            border: "border-red-200 dark:border-red-800",
          },
          {
            label: "Expert",
            value: stats.expert,
            bg: "bg-purple-50 dark:bg-purple-900/20",
            text: "text-purple-700 dark:text-purple-400",
            valueText: "text-purple-700 dark:text-purple-400",
            border: "border-purple-200 dark:border-purple-800",
          },
          {
            label: "User",
            value: stats.user,
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-700 dark:text-blue-400",
            valueText: "text-blue-700 dark:text-blue-400",
            border: "border-blue-200 dark:border-blue-800",
          },
          {
            label: "Active",
            value: stats.active,
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            text: "text-emerald-700 dark:text-emerald-400",
            valueText: "text-emerald-700 dark:text-emerald-400",
            border: "border-emerald-200 dark:border-emerald-800",
          },
          {
            label: "Unactive",
            value: stats.unactive,
            bg: "bg-gray-50 dark:bg-gray-900/50",
            text: "text-gray-600 dark:text-gray-400",
            valueText: "text-gray-700 dark:text-gray-400",
            border: "border-gray-200 dark:border-gray-700",
          },
          {
            label: "Banned",
            value: stats.banned,
            bg: "bg-red-50 dark:bg-red-900/20",
            text: "text-red-700 dark:text-red-400",
            valueText: "text-red-700 dark:text-red-400",
            border: "border-red-200 dark:border-red-800",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.bg} rounded-lg p-6 border ${stat.border}`}
          >
            <div className={`text-sm ${stat.text} mb-2`}>{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.valueText}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">Chưa có thành viên nào</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Chưa có thành viên nào trong hệ thống
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user: any) => {
            const createdDate = new Date(user.createdAt);

            return (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name || "User"}
                            width={64}
                            height={64}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            {(user.name || user.email)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold truncate">
                            {user.name || "No name"}
                          </h3>
                          <Badge variant={getRoleVariant(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge variant={getStatusVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Email:</span>{" "}
                            {user.email}
                          </div>
                          {user.username && (
                            <div className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Username:</span>{" "}
                              {user.username}
                            </div>
                          )}
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Ngày tạo:</span>{" "}
                            {format(createdDate, "dd/MM/yyyy HH:mm", {
                              locale: vi,
                            })}
                          </div>
                        </div>

                        {/* Course Stats */}
                        <div className="flex gap-6 mt-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Khóa học đã tạo:
                            </span>
                            <span className="font-semibold text-primary">
                              {user.courses?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Khóa học đã mua:
                            </span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {user.purchasedCourses?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <UpdateUserStatus
                        userId={user._id}
                        currentStatus={user.status}
                      />
                      <UpdateUserRole
                        userId={user._id}
                        currentRole={user.role}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageMemberPage;
