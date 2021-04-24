import { useState, useEffect, useContext } from "react";
import { AuthErrorContext, PrimerContext } from "./ClientContext";
import { fetcher, fetcherOpts } from "./fetcher";

export type UseFetchOpts<T> = fetcherOpts<T> & {
  initial?: T;
  disabled?: boolean;
};

export function useFetch<T>(
  host: string,
  edge: string,
  opts?: UseFetchOpts<T>,
) {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>();
  const [body, setBody] = useState<T | undefined>(opts?.initial);
  const [refresher, setRefresher] = useState(false);
  const authError = useContext(AuthErrorContext);

  useEffect(() => {
    let disabled = typeof opts?.disabled === "boolean" ? opts.disabled : false;
    if (!disabled) {
      const controller = new AbortController();
      setLoading(true);
      fetcher(host, edge, { ...opts, controller })
        .then((d) => {
          setResp(d);
          setBody(d?.body);
          setLoading(false);
        })
        .catch((e: Error) => {
          setResp(e);
          setBody(undefined);

          if (e.message.includes("Client") || e.message.includes("Login")) {
            console.error("RUQQUS AUTH ERROR", e);
            authError(e);
          }

          setLoading(false);
        });

      return () => {
        controller.abort();
      };
    }
  }, [
    opts?.body,
    refresher,
    opts?.disabled,
    ...Object.values(opts?.args || {}),
  ]);

  return { loading, resp, body, refresh: () => setRefresher((x) => !x) };
}
