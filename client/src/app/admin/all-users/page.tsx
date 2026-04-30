import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import AdminAllUsers from "@/components/AdminAllUsers/AdminAllUsers";
import { IUser } from "@/types";

export default async function AllUsersPage() {
  const session = await verifySession();

  // Захист: Менеджери не мають доступу до списку юзерів (згідно твого меню)
  // Якщо в menus.ts у менеджера немає цього пункту, то і тут його треба відшити
  if (!session || session.role !== "admin") {
     // Якщо це менеджер - хай йде до постів
     if (session?.role === "manager") redirect("/admin/all-posts");
     redirect("/");
  }

  await connectToDB();

  // Отримуємо всіх користувачів, сортуємо за датою створення
  const userDocuments = await User.find({}).sort({ createdAt: -1 }).lean();

  // Перетворюємо дані для передачі клієнтському компоненту
  const users = userDocuments.map((userDocument: IUser) => ({
    _id: userDocument._id.toString(),
    email: userDocument.email,
    name: `${userDocument.lastName || ""} ${userDocument.firstName || ""}`.trim() || userDocument.email, // Якщо ПІБ немає, показуємо email
    role: userDocument.role,
    createdAt: userDocument.createdAt ? userDocument.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: userDocument.updatedAt ? userDocument.updatedAt.toISOString() : new Date().toISOString(),
  }));

  return (
    <AdminAllUsers 
      users={users} 
      isSuperAdmin={session.role === "admin"} 
    />
  );
}