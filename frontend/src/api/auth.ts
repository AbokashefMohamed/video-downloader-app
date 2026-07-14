import api from "./client";
import { AuthResponse, UpdateProfileDto, User } from "../types";


// register a new account
export async function register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}


// login with existing account
export async function login(data: { email: string; password: string }): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}

//update name or password
export async function updateProfile(data: UpdateProfileDto): Promise<User> {
  const response = await api.patch<User>("/auth/me", data);
  return response.data;
}

// delete the loggedin user's account
export async function deleteAccount(data: {password: string}): Promise<void> {
  await api.delete("/auth/me", {data});
}

// get the loggedin user's info
export async function getMe(): Promise<User> {
  const response = await api.get<User>("/auth/me");
  return response.data;
} 
