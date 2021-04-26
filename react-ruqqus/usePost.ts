import { useRuqqusFetch } from "./useRuqqusFetch";
import { RuqqusPost } from "react-ruqqus/types";

export function usePost(pid: string) {
  return useRuqqusFetch<RuqqusPost>(`post/${pid}`);
}
