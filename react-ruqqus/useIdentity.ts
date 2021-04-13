import {useRuqqusFetch} from './useRuqqusFetch';

export function useIdentity() {
  return useRuqqusFetch('identity');
}
