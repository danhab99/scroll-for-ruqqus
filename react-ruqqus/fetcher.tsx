export function fetcher(host, edge, {args, body, access_token} = {}) {
  var a = Object.entries(args || {})
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  let reqbody = Object.entries(body || {}).map(
    ([key, value]) => `${key}=${value}`,
  );
  reqbody = reqbody.join('&');

  return fetch(`https://${host}/${edge}${a ? '?' : ''}${a}`, {
    method: body ? 'POST' : 'GET',
    body: reqbody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-User-Type': 'App',
      'X-Library': 'react-ruqqus',
      'X-Supports': 'auth',
      'User-Agent': `scroll-for-ruqqus`,
      Authorization: `Bearer ${access_token}`,
    },
    redirect: 'manual',
  })
    .then(async (r) => {
      return {
        ...r,
        body: await (r.headers.get('content-type').includes('json')
          ? r.json()
          : r.text()),
      };
    })
    .then((r) => {
      if (r.ok) {
        return r;
      } else if (
        r?.body?.error == '401 Not Authorized. Invalid or Expired Token'
      ) {
        throw new Error('Login error');
      } else {
        throw new Error('Client error', r);
      }
    });
}
