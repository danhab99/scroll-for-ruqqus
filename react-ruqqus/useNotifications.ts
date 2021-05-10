import { RuqqusNotifications } from "./types";
import { useRuqqusFetch } from "./useRuqqusFetch";

export function useNotifications() {
  return useRuqqusFetch<RuqqusNotifications>("notifications");
}
