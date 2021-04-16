export interface fetcherOpts {
  args?: Object;
  body?: any;
  access_token?: string;
}

function seralize(obj: any): string {
  return Object.entries(obj || {})
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export function fetcher(host: string, edge: string, opts: fetcherOpts = {}) {
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
      Authorization: `Bearer ${opts.access_token}`,
    },
    // redirect: 'manual',
  };

  console.log("RUQQUS FETCH", { host, edge, opts, options });

  return fetch(
    `https://${host}/${edge}${args ? "?" : ""}${args}`.toLowerCase(),
    options,
  )
    .then((r) => {
      let isObject: boolean = (r.headers.get("content-type") || "").includes(
        "json",
      );
      let b: Promise<any> = isObject ? r.json() : r.text();

      return b.then((body) => ({
        ...r,
        body,
      }));
    })
    .then((r) => {
      console.log("RUQQUS FETCH DONE", { host, edge, opts, options, r });
      if (r.ok) {
        return r;
      } else if (
        typeof r.body === "object" &&
        r.body["error"] == "401 Not Authorized. Invalid or Expired Token"
      ) {
        throw new Error("Login error: " + JSON.stringify(r));
      } else {
        throw new Error("Client error: " + JSON.stringify(r));
      }
    });
}
