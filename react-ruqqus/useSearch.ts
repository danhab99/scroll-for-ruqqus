import { RuqqusPost } from "./types";
import { useRuqqusFetch } from "./useRuqqusFetch";

export function useSearch(query: string) {
  return useRuqqusFetch<RuqqusPost[]>(`search?q=${query}`);
}
