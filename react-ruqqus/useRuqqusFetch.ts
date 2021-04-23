import { useFetch, UseFetchOpts } from "./useFetch";
import { useRuqqusClient } from "./useRuqqusClient";
import { useContext } from "react";
import { PrimerContext } from "./ClientContext";

export function useRuqqusFetch<T>(edge: string, opts: UseFetchOpts<T> = {}) {
  const client = useRuqqusClient();
  const ready = useContext(PrimerContext);

  return useFetch<T>(
    client.domain,
    "api/v1/" + edge,
    Object.assign(opts, {
      access_token: client.access_token,
      disabled: !ready,
    }),
  );
}
