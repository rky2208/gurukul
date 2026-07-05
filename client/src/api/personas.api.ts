import { get } from "./http";
import type { Persona } from "../types";

export async function fetchPersonas(): Promise<Persona[]> {
  return get<Persona[]>("/personas");
}
