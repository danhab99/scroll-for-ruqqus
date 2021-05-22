import { RuqqusNotifications } from "./types";
import { useRuqqusFetch } from "./useRuqqusFetch";

export function useNotifications(all: boolean = false) {
  return useRuqqusFetch<{ data: RuqqusNotifications }>("notifications", {
    args: {
      all: all ? "True" : "",
    },
  });
}
