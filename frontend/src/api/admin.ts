
import { User } from "../types";
import api from "./client";

// get all users (admin only)
export async function getAllUsers(): Promise<User[]> {
  const response = await api.get<User[]>("/admin/users");
  return response.data;
}


// update another user's name or role — admin only
export async function adminUpdateUser(userId: string, data: { name?: string; role?: 'user' | 'admin' }): Promise<User> {
  const response = await api.patch<User>(`/admin/users/${userId}`, data);
  return response.data;
}

// delete another user's account — admin only
export async function adminDeleteUser(id: string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}