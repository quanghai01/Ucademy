"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/lib/actions/user.actions";
import { EUserRole } from "@/app/types/enums";
import { toast } from "sonner";

interface UpdateUserRoleProps {
    userId: string;
    currentRole: EUserRole;
    onSuccess?: () => void;
}

export default function UpdateUserRole({
    userId,
    currentRole,
    onSuccess,
}: UpdateUserRoleProps) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const roleOptions = [
        { value: EUserRole.USER, label: "User", color: "text-blue-700" },
        { value: EUserRole.EXPERT, label: "Expert", color: "text-purple-700" },
        { value: EUserRole.ADMIN, label: "Admin", color: "text-red-700" },
    ];

    const availableRoles = roleOptions.filter(
        (role) => role.value !== currentRole
    );

    const handleUpdateRole = async (newRole: EUserRole) => {
        if (
            !confirm(
                `Bạn có chắc muốn đổi role user này thành "${roleOptions.find((r) => r.value === newRole)?.label
                }"?`
            )
        ) {
            return;
        }

        setLoading(true);

        try {
            const result = await updateUserRole(userId, newRole);

            if (!result.success) {
                toast.error(result.message || "Không thể cập nhật role");
                setLoading(false);
                return;
            }

            toast.success("Cập nhật role thành công");
            setIsOpen(false);

            // Refresh page to show updated role
            window.location.reload();

            onSuccess?.();
        } catch (error) {
            console.error("❌ Update role error:", error);
            toast.error("Có lỗi xảy ra");
            setLoading(false);
        }
    };

    if (availableRoles.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
                Đổi role
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                        <div className="p-2">
                            {availableRoles.map((role) => (
                                <button
                                    key={role.value}
                                    onClick={() => handleUpdateRole(role.value)}
                                    disabled={loading}
                                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${role.color} disabled:opacity-50`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
