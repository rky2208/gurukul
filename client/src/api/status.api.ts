import { get } from "./http";
import type { StatusResponse } from "../types";

export async function fetchStatus(): Promise<StatusResponse> {
  return get<StatusResponse>("/status");
}
