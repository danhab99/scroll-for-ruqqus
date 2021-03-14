import React, {createContext, useContext} from 'react';
import {useState} from 'react';

const ClientContext = createContext();

export function RuqqusClientProvider(props) {
  return (
    <ClientContext.Provider value={props.client}>
      {props.children}
    </ClientContext.Provider>
  );
}

export function useRuqqusClient() {
  return useContext(ClientContext);
}

export function useQuery(edge, opts) {
  const client = useRuqqusClient();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  return {loading, data, error, client};
}
