import {useFetch, UseFetchOpts} from './useFetch';
import {useRuqqusClient} from './useRuqqusClient';

export function useRuqqusFetch(edge: string, opts: UseFetchOpts | undefined) {
  const client = useRuqqusClient();
  return useFetch(client?.domain || '', edge, opts);
}
