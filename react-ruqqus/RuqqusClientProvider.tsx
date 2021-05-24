import React, { useState, useEffect, useContext } from "react";
import {
  UserContext,
  WebAuthContext,
  ClientContext,
  ApiErrorContext,
  PrimerContext,
} from "./ClientContext";
import { fetcher } from "./fetcher";
import _ from "lodash";

interface RuqqusClientProviderProps {
  config: {
    domain: string;
    authserver: string;
  };
  onApiError?: (e: Error) => void;
  children: React.ReactNode;
}

export interface TokenInterface {
  access_token: string;
  refresh_token: string;
  client_id: string;
  expires_at: number;
  siteID: string;
}

export function RuqqusClientProvider(props: RuqqusClientProviderProps) {
  const [tokens, setTokens] = useState<TokenInterface>();
  const [authSite, setAuthSite] = useState<string>();
  const [ready, setReady] = useState(false);

  const clientConfig = Object.assign(
    {
      domain: "ruqqus.com",
      authserver: "sfroa.danhab99.xyz",
      access_token: "",
      refresh_token: "",
      client_id: "",
      expires_at: -1,
      siteID: "",
      ...tokens,
    },
    props.config,
  );

  const refreshTokens = (tokens: any) => {
    if (tokens?.siteID) {
      console.log("RUQQUS REFRESHING TOKENS");
      setReady(false);
      fetcher<TokenInterface, { refresh_token: string }>(
        clientConfig.authserver,
        `auth/${tokens.siteID}/refresh`,
        {
          body: {
            refresh_token: tokens.refresh_token,
          },
          access_token: tokens.access_token,
        },
      ).then((resp) => {
        if (resp.ok) {
          console.log("RUQQUS READY");
          setTokens((prev): TokenInterface => {
            let p = _.assign({}, prev, {
              access_token: resp.body["access_token"],
              expires_at: resp.body["expires_at"],
            });

            return p;
          });
          setReady(true);
        } else {
          props.onApiError?.(new Error("Token error"));
        }
      });
    }
  };

  useEffect(() => {
    if (tokens) {
      console.log("RUQQUS TOKENS CHANGED", tokens, props.config);
      refreshTokens(tokens);

      let timeout = setTimeout(() => refreshTokens(tokens), 600000);
      return () => clearTimeout(timeout);
    } else {
      props.onApiError?.(new Error("No tokens"));
    }
  }, [tokens?.refresh_token, tokens?.siteID, props.config]);

  return (
    <UserContext.Provider value={setTokens}>
      <WebAuthContext.Provider value={{ authSite, setAuthSite }}>
        <ClientContext.Provider value={clientConfig as any}>
          <ApiErrorContext.Provider
            value={(e) => props.onApiError && props.onApiError(e)}>
            <PrimerContext.Provider value={ready}>
              {props.children}
            </PrimerContext.Provider>
          </ApiErrorContext.Provider>
        </ClientContext.Provider>
      </WebAuthContext.Provider>
    </UserContext.Provider>
  );
}

export function useLogin() {
  const setTokens = useContext(UserContext);

  return (t: TokenInterface) => {
    setTokens(t);
  };
}
