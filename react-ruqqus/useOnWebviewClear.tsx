import {useEffect} from 'react';
import {useRuqqusClient} from './useRuqqusClient';

export function useOnWebviewClear(clear: () => void) {
  const client = useRuqqusClient();

  useEffect(() => {
    if (client?.access_token) {
      debugger;
      clear();
    }
  }, [client]);
}
