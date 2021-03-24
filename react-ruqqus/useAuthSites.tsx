import {useContext} from 'react';
import {WebAuthContext} from './ClientContext';
import {fetcher} from './fetcher';
import {useFetch} from './useFetch';
import {useRuqqusClient} from './useRuqqusClient';

export function useAuthSites() {
  const client = useRuqqusClient();
  const {setAuthSite} = useContext(WebAuthContext);
  const {loading, body} = useFetch(client?.authserver || '', 'sites');

  const getAuthURL = (id: string) => {
    return fetcher(client?.authserver || '', `auth/${id}`).then((resp) => {
      setAuthSite(resp.url);
      return resp.url;
    });
  };

  return {loading, sites: body, getAuthURL};
}
