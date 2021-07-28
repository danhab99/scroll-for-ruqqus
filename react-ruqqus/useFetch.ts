import { useState, useEffect, useContext } from "react";
import { ApiErrorContext, PrimerContext } from "./ClientContext";
import { fetcher, fetcherOpts } from "./fetcher";

const pdebug = (msg: string, ...extras: any) => console.debug(`useFetch | ${msg}`, ...extras)

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
        pdebug("Disabled is a function")
        disabled = opts.disabled?.();
        break;
      case "boolean":
        pdebug("Disabled is a value")
        disabled = opts.disabled;
        break;
      default:
        pdebug("Not disabled")
        disabled = false;
    }

    if (!disabled) {
      pdebug("Running fetch")
      const controller = new AbortController();
      setLoading(true);
      fetcher<RESPONSE_BODY>(host, edge, { ...opts, controller })
        .then((d) => {
          setResp(d);
          setBody((prev) => {
            if (opts?.onBodyChange) {
              pdebug("Transforming body")
              return opts.onBodyChange?.(
                prev,
                opts.args,
                d.body as RESPONSE_BODY,
              );
            } else {
              pdebug("Returning body")
              return d.body;
            }
          });
          setLoading(false);
        })
        .catch((e: Error) => {
          pdebug("Error", e)
          apiError(e);
          setResp(e);
          setBody(undefined);
          setLoading(false);
        });

      return () => {
        pdebug("Effect cleaning up, aborting fetch")
        controller.abort();
      };
    }
  }, [
    refresher,
    opts?.body,
    opts?.disabled,
    ...Object.values(opts?.args || {}),
  ]);

  const refresh = () => {
    pdebug("Refreshing")
    setRefresher((x) => !x) }

  return {
    loading,
    resp,
    body,
    refresh,
    setBody,
  };
}
