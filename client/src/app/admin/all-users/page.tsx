import { cookies } from "next/headers";
import { usersServerApi } from "@/api/users.server";
import AdminAllUsers from "@/components/AdminAllUsers/AdminAllUsers";
import { tableUserData } from "@/types";

export default async function AllUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  let users: tableUserData[] = [];
  if (token) {
    try {
      const userDocuments = await usersServerApi.getAllUsers(token);
      users = userDocuments.map((userDocument: Record<string, unknown>) => ({
        _id: String(userDocument._id || ""),
        email: String(userDocument.email || ""),
        name: `${String(userDocument.lastName || "")} ${String(userDocument.firstName || "")}`.trim() || String(userDocument.email || ""),
        role: String(userDocument.role || ""),
        createdAt: userDocument.createdAt ? new Date(userDocument.createdAt as string).toISOString() : new Date().toISOString(),
        updatedAt: userDocument.updatedAt ? new Date(userDocument.updatedAt as string).toISOString() : new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  return (
    <AdminAllUsers 
      users={users} 
      isSuperAdmin={true} 
    />
  );
}