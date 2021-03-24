import React, {createContext, useContext, useState, useEffect} from 'react';
import {useValue} from './storage-context';

const ClientContext = createContext();

export function RuqqusClientProvider(props) {
  const activeID = useValue('activeID');
  const navigation = useNavigation();

  const [ready, setReady] = useState(false);
  const [client, setClient] = useState();

  useEffect(async () => {
    if (!activeID) {
      navigation.navigate('Login');
      return;
    }

    setClient(InitClient(activeID));
    setReady(true);
  }, [activeID]);

  return (
    <ClientContext.Provider value={{ready, client}}>
      {props.children}
    </ClientContext.Provider>
  );
}

export function useRuqqusClient() {
  return useContext(ClientContext);
}

// export function useQuery(edge, opts) {
//   const client = useRuqqusClient();
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState();
//   const [error, setError] = useState();

//   return {loading, data, error, client};
// }
