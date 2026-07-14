import api from "./client";
import { HistoryEntry } from "../types";

// get the loggedin user's download history
export async function getHistory(): Promise<HistoryEntry[]> {
  const response = await api.get<HistoryEntry[]>("/history");
  return response.data;
}

// delete a specific history entry
export async function deleteHistoryEntry(id: string): Promise<void> {
    await api.delete(`/history/${id}`);
}


// clear all history for the logged ing user
export async function clearHistory(): Promise<void>{
    await api.delete("/history");
}