import { auth, clerkClient } from "@clerk/nextjs/server";
import { EUserRole } from "@/app/types/enums";
import User from "@/database/user.model";
import { connectToDatabase } from "./mongoose";

export async function getRole() {
    const session = await auth();
    let role = session.sessionClaims?.metadata?.role;

    if (!role && session.userId) {
        // Fallback to DB if metadata is not synced yet
        await connectToDatabase();
        const user = await User.findOne({ clerkId: session.userId }).lean();
        if (user) {
            role = user.role;
            // Sync to Clerk publicMetadata for future client-side use
            try {
                const client = await clerkClient();
                await client.users.updateUserMetadata(session.userId, {
                    publicMetadata: {
                        role: user.role,
                    },
                });
                console.log(`[AUTH-SYNC] Successfully synced role for ${session.userId} to Clerk`);
            } catch (error) {
                console.error(`[AUTH-SYNC-ERROR] Failed to sync role for ${session.userId}`, error);
            }
        }
    }

    return role;
}

export async function isAdmin() {
    const role = await getRole();
    return role === EUserRole.ADMIN;
}

export async function isExpert() {
    const role = await getRole();
    return role === EUserRole.EXPERT || role === EUserRole.ADMIN;
}
