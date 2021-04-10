export interface fetcherOpts {
  args?: Object;
  body?: any;
  access_token?: string;
}

export function fetcher(host: string, edge: string, opts: fetcherOpts = {}) {
  var a = Object.entries(opts.args || {})
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  let reqbody = Object.entries(opts.body || {}).map(
    ([key, value]) => `${key}=${value}`,
  );
  let reqBodySerialized = reqbody.join('&');

  return fetch(`https://${host}/${edge}${a ? '?' : ''}${a}`, {
    method: opts.body ? 'POST' : 'GET',
    body: reqBodySerialized,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-User-Type': 'App',
      'X-Library': 'react-ruqqus',
      'X-Supports': 'auth',
      'User-Agent': `scroll-for-ruqqus`,
      Authorization: `Bearer ${opts.access_token}`,
    },
    // redirect: 'manual',
  })
    .then((r) => {
      let isObject: boolean = (r.headers.get('content-type') || '').includes(
        'json',
      );
      let b: Promise<any> = isObject ? r.json() : r.text();

      return b.then((body) => ({
        ...r,
        body,
      }));
    })
    .then((r) => {
      if (r.ok) {
        return r;
      } else if (
        typeof r.body === 'object' &&
        r.body['error'] == '401 Not Authorized. Invalid or Expired Token'
      ) {
        throw new Error('Login error');
      } else {
        throw new Error('Client error');
      }
    });
}
