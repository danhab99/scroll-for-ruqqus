import {useEffect, useRef} from 'react';
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
  const lastToken = useRef<string>();

  useEffect(() => {
    if (client?.access_token) {
      if (client.access_token !== lastToken.current) {
        lastToken.current = client.access_token;

        fetcher(client.domain, '/api/v1/identity', {
          access_token: client.access_token,
        }).then((resp) => {
          clear({
            ...client,
            user: resp.body as RuqqusUser,
          });
        });
      }
    }
  }, [client]);
}
