import React, {useState, useEffect} from 'react';
import {
  UserContext,
  WebAuthContext,
  ClientContext,
  AuthErrorContext,
} from './ClientContext';
import {fetcher} from './fetcher';

export function RuqqusClientProvider(props) {
  const [tokens, setTokens] = useState();
  const [authSite, setAuthSite] = useState();

  const clientConfig = Object.assign(
    {
      domain: 'ruqqus.com',
      authserver: 'sfroa.danhab99.xyz',
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
        }).then((resp) => {
          setTokens((prev) => ({
            ...prev,
            access_token: resp.body.access_token,
            refresh_token: resp.body.refresh_token || prev.refresh_token,
          }));
        });
      }, Date.now() - tokens.expires_at);

      return () => clearInterval(interval);
    }
  }, [tokens, props.config]);

  return (
    <UserContext.Provider value={setTokens}>
      <WebAuthContext.Provider value={{authSite, setAuthSite}}>
        <ClientContext.Provider
          value={{
            ...props?.config,
            domain: props?.config?.domain || 'ruqqus.com',
            authServer: props?.config?.authServer || 'sfroa.danhab99.xyz',
            ...tokens,
          }}>
          <AuthErrorContext.Provider
            value={() => props.onLoginError && props.onLoginError()}>
            {props.children}
          </AuthErrorContext.Provider>
        </ClientContext.Provider>
      </WebAuthContext.Provider>
    </UserContext.Provider>
  );
}
