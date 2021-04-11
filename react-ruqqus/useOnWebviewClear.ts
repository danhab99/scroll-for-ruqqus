import {useEffect} from 'react';
import {fetcher} from './fetcher';
import {RuqqusUser} from './types';
import {useRuqqusClient} from './useRuqqusClient';

interface UserData {
  access_token: string;
  refresh_token: string;
  user: RuqqusUser;
}

export function useOnWebviewClear(clear: (user: UserData) => void) {
  const client = useRuqqusClient();

  useEffect(() => {
    if (client?.access_token) {
      debugger;

      fetcher(client.domain, '/api/v1/identity', {
        access_token: client.access_token,
      }).then((resp) => {
        clear({
          access_token: client.access_token,
          refresh_token: client.refresh_token,
          user: resp.body as RuqqusUser,
        });
      });
    }
  }, [client]);
}
