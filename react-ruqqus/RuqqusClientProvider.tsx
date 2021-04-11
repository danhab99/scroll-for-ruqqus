import React, {useState, useEffect} from 'react';
import {
  UserContext,
  WebAuthContext,
  ClientContext,
  AuthErrorContext,
} from './ClientContext';
import {fetcher} from './fetcher';

interface RuqqusClientProviderProps {
  config: {
    domain: string;
    authserver: string;
  };
  onLoginError?: () => void;
  children: React.ReactNode;
}

export interface TokenInterface {
  access_token: string;
  refresh_token: string;
  client_id: string;
  expires_at: number;
}

export function RuqqusClientProvider(props: RuqqusClientProviderProps) {
  const [tokens, setTokens] = useState<TokenInterface>();
  const [authSite, setAuthSite] = useState<string>();

  const clientConfig = Object.assign(
    {
      domain: 'ruqqus.com',
      authserver: 'sfroa.danhab99.xyz',
      access_token: '',
      refresh_token: '',
      client_id: '',
      expires_at: -1,
      ...tokens,
    },
    props.config,
  );

  useEffect(() => {
    if (tokens) {
      debugger;
      const interval = setInterval(() => {
        fetcher(clientConfig.authserver, `/auth/${tokens.client_id}/refresh`, {
          body: {
            refresh_token: tokens.refresh_token,
          },
          access_token: tokens.access_token,
        }).then((resp) => {
          setTokens(
            (prev): TokenInterface => {
              return {
                client_id: resp.body['client_id'] || prev?.client_id,
                access_token: resp.body['access_token'] || prev?.access_token,
                refresh_token:
                  resp.body['refresh_token'] || prev?.refresh_token,
                expires_at: resp.body['expires_at'] || prev?.expires_at,
              };
            },
          );
        });
      }, Date.now() - tokens.expires_at);

      return () => clearInterval(interval);
    }
  }, [tokens, props.config]);

  return (
    <UserContext.Provider value={setTokens}>
      <WebAuthContext.Provider value={{authSite, setAuthSite}}>
        <ClientContext.Provider value={clientConfig as any}>
          <AuthErrorContext.Provider
            value={() => props.onLoginError && props.onLoginError()}>
            {props.children}
          </AuthErrorContext.Provider>
        </ClientContext.Provider>
      </WebAuthContext.Provider>
    </UserContext.Provider>
  );
}
