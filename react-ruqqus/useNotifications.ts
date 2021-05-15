import { RuqqusNotifications } from "./types";
import { useRuqqusFetch } from "./useRuqqusFetch";

export function useNotifications(all: boolean = false) {
  return useRuqqusFetch<RuqqusNotifications>("notifications", {
    args: all ? "true" : "false",
  });
}
