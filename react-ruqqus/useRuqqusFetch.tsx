import {useFetch} from './useFetch';
import {useRuqqusClient} from './useRuqqusClient';

export function useRuqqusFetch(edge, opts) {
  const client = useRuqqusClient();
  return useFetch(client.domain, edge, opts);
}
