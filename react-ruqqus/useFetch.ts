import { useState, useEffect } from "react";
import { fetcher, fetcherOpts } from "./fetcher";

export type UseFetchOpts<T> = fetcherOpts & { initial?: T; disabled?: boolean };

export function useFetch<T>(host: string, edge: string, opts?: UseFetchOpts) {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>();
  const [body, setBody] = useState<T>(opts?.initial);
  const [refresher, setRefresher] = useState(false);

  useEffect(() => {
    let disabled = typeof opts?.disabled === "boolean" ? opts.disabled : false;
    if (!disabled) {
      setLoading(true);
      fetcher(host, edge, opts).then((d) => {
        setResp(d);
        setBody(d?.body);
        setLoading(false);
      });
    }
  }, [
    opts?.body,
    ...Object.values(opts?.args || {}),
    refresher,
    opts?.disable,
  ]);

  return { loading, resp, body, refresh: () => setRefresher((x) => !x) };
}
