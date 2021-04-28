import { RuqqusUser } from "./types";
import { useRuqqusFetch } from "./useRuqqusFetch";

export function useIdentity() {
  return useRuqqusFetch<RuqqusUser>("identity");
}
