import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/api/auth.server";
import { usersServerApi } from "@/api/users.server";
import AdminAllUsers from "@/components/AdminAllUsers/AdminAllUsers";
import { tableUserData } from "@/types";

export default async function AllUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const session = await getSession();

  if (!token) {
     redirect("/");
  }

  // Захист: Менеджери не мають доступу до списку юзерів
  if (!session || session.role !== "admin") {
     if (session?.role === "manager") redirect("/admin/all-posts");
     redirect("/");
  }

  let users: tableUserData[] = [];
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

  return (
    <AdminAllUsers 
      users={users} 
      isSuperAdmin={session.role === "admin"} 
    />
  );
}