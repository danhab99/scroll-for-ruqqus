import {useState, useEffect} from 'react';
import {fetcher} from './fetcher';

export function useFetch(host, edge, opts) {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState();
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
