import { useState, useEffect, useContext } from "react";
import { ApiErrorContext, PrimerContext } from "./ClientContext";
import { fetcher, fetcherOpts } from "./fetcher";

export type UseFetchOpts<RESPONCE_BODY> = fetcherOpts<RESPONCE_BODY> & {
  disabled?: (() => boolean) | boolean;
  onBodyChange?: (
    old: RESPONCE_BODY | undefined,
    args: any,
    incoming: RESPONCE_BODY,
  ) => RESPONCE_BODY;
  initial?: RESPONCE_BODY;
};

export function useFetch<RESPONSE_BODY>(
  host: string,
  edge: string,
  opts?: UseFetchOpts<RESPONSE_BODY>,
) {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>();
  const [body, setBody] = useState<RESPONSE_BODY | undefined>(opts?.initial);
  const [refresher, setRefresher] = useState(false);
  const apiError = useContext(ApiErrorContext);

  useEffect(() => {
    let disabled: boolean;
    switch (typeof opts?.disabled) {
      case "function":
        disabled = opts.disabled?.();
        break;
      case "boolean":
        disabled = opts.disabled;
        break;
      case "undefined":
      default:
        disabled = false;
    }

    if (!disabled) {
      const controller = new AbortController();
      setLoading(true);
      fetcher<RESPONSE_BODY>(host, edge, { ...opts, controller })
        .then((d) => {
          setResp(d);
          setBody((prev) => {
            if (opts?.onBodyChange) {
              return opts.onBodyChange?.(
                prev,
                opts.args,
                d.body as RESPONSE_BODY,
              );
            } else {
              return d.body;
            }
          });
          setLoading(false);
        })
        .catch((e: Error) => {
          apiError(e);
          setResp(e);
          setBody(undefined);
          setLoading(false);
        });

      return () => {
        controller.abort();
      };
    }
  }, [
    refresher,
    opts?.body,
    opts?.disabled,
    ...Object.values(opts?.args || {}),
  ]);

  return {
    loading,
    resp,
    body,
    refresh: () => setRefresher((x) => !x),
    setBody,
  };
}
