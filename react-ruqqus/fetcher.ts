import fetch from "unfetch";
import encodeurl from "encodeurl";
export interface fetcherOpts<T> {
  args?: Object;
  body?: T;
  access_token?: string;
  controller?: AbortController;
}

function seralize(obj: any): string {
  return Object.entries(obj || {})
    .map(([key, value]) => `${key}=${encodeurl(value)}`)
    .join("&");
}

var FETCH_ID = 0;

export function fetcher<T>(
  host: string,
  edge: string,
  opts: fetcherOpts<T> = {},
) {
  let args = seralize(opts.args);
  let reqbody = seralize(opts.body);

  let options = {
    method: opts.body ? "POST" : "GET",
    body: reqbody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-User-Type": "App",
      "X-Library": "react-ruqqus",
      "X-Supports": "auth",
      "User-Agent": `scroll-for-ruqqus`,
      ...(opts.access_token && {
        Authorization: `Bearer ${opts.access_token}`,
      }),
    },
    signal: opts.controller,
  };

  const fid = FETCH_ID++;
  if (opts.controller) {
    opts.controller.signal.onabort = () => {
      console.log("RUQQUS FETCH ABORTED", host, edge, fid);
    };
  }

  console.log("RUQQUS FETCH", { host, edge, opts, options, fid });

  const url = [
    "https://",
    host,
    edge[0] === "/" ? "" : "/",
    edge,
    args ? "?" : "",
    args,
  ]
    .join("")
    .toLowerCase();

  return fetch(url, options)
    .then((r) => {
      let isObject: boolean = (r.headers.get("content-type") || "").includes(
        "json",
      );
      let b: Promise<any> = isObject ? r.json() : r.text();

      return b.then((body: T) => ({
        ...r,
        body,
      }));
    })
    .then((resp) => {
      console.log("RUQQUS FETCH DONE", {
        host,
        edge,
        opts,
        options,
        resp,
        fid,
      });
      if (resp.ok) {
        return resp;
      } else if (
        typeof resp.body === "object" &&
        resp.body["error"] == "401 Not Authorized. Invalid or Expired Token"
      ) {
        throw new Error("Login error: " + JSON.stringify(resp));
      } else {
        throw new Error("Client error: " + JSON.stringify(resp));
      }
    });
}
