import { cookies } from "next/headers";
import { fetchApi } from "./config";
import { IUser } from "@/types";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) return null;

  try {
    const data = await fetchApi<{ user: IUser }>('/api/auth/me', {
      headers: { Cookie: `token=${token}` },
    });
    
    return data.user;
  } catch (err) {
    return null;
  }
}
