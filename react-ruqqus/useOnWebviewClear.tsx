import {useEffect} from 'react';
import {useRuqqusClient} from './useRuqqusClient';

interface UserData {
  access_token: string;
  refresh_token: string;
  // username: string;
}

export function useOnWebviewClear(clear: (user: UserData) => void) {
  const client = useRuqqusClient();

  useEffect(() => {
    if (client?.access_token) {
      debugger;
      clear({
        access_token: client.access_token,
        refresh_token: client.refresh_token,
      });
    }
  }, [client]);
}
