import {useState, useEffect} from 'react';
import {fetcher, fetcherOpts} from './fetcher';

export type UseFetchOpts = fetcherOpts & {initial?: any};

export function useFetch(host: string, edge: string, opts?: UseFetchOpts) {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<any>();
  const [body, setBody] = useState(opts?.initial);
  const [refresher, setRefresher] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetcher(host, edge, opts).then((d) => {
      setResp(d);
      setBody(d?.body);
      setLoading(false);
    });
  }, [opts?.body, ...Object.values(opts?.args || {}), refresher]);

  return {loading, resp, body, refresh: () => setRefresher((x) => !x)};
}