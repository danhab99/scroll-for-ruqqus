import { RuqqusPost } from "./types";
import { useRuqqusFetch } from "./useRuqqusFetch";

export function useSearch(query: string) {
  return useRuqqusFetch<RuqqusPost[]>("search", {
    args: {
      q: query,
    },
  });
}
