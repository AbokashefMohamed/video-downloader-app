import api from "./client";
import {ProbeResult} from "../types";

// fetch video metadata without downloding
export async function probeUrl(url: string): Promise<ProbeResult> {
  const response = await api.post<ProbeResult>("/probe", {url});
  return response.data;
}