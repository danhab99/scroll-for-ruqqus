import {useState, useEffect} from 'react';
import {fetcher, fetcherOpts} from './fetcher';

export type UseFetchOpts = fetcherOpts & {initial?: any};

export function useFetch(host: string, edge: string, opts?: UseFetchOpts) {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>();
  const [body, setBody] = useState(opts?.initial);

  useEffect(() => {
    setLoading(true);
    fetcher(host, edge, opts).then((d) => {
      setResp(d);
      setBody(d?.body);
      setLoading(false);
    });
  }, [opts?.body, ...Object.values(opts?.args || {})]);

  return {loading, resp, body};
}
