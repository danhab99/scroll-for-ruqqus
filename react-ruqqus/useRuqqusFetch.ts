import { useFetch, UseFetchOpts } from "./useFetch";
import { useRuqqusClient } from "./useRuqqusClient";

export function useRuqqusFetch<T>(edge: string, opts: UseFetchOpts<T> = {}) {
  const client = useRuqqusClient();
  return useFetch<T>(
    client.domain,
    "api/v1/" + edge,
    Object.assign(opts, {
      access_token: client.access_token,
      disabled: !client.access_token ? true : false,
    }),
  );
}
