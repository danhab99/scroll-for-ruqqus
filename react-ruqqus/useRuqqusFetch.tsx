import {useFetch, UseFetchOpts} from './useFetch';
import {useRuqqusClient} from './useRuqqusClient';

export function useRuqqusFetch(edge: string, opts?: UseFetchOpts) {
  const client = useRuqqusClient();
  return client?.access_token
    ? useFetch(
        client.domain,
        '/api/v1/' + edge,
        Object.assign(opts, {access_token: client.access_token}),
      )
    : {
        loading: false,
        resp: new Error('No access token specified'),
        body: new Error('No access token specified'),
      };
}
