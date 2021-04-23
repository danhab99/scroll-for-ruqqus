import { RuqqusUser } from "./types";
import { useRuqqusFetch } from "./useRuqqusFetch";

export function useIdentity() {
  debugger;
  return useRuqqusFetch<RuqqusUser>("identity");
}
