import { useContext, useEffect, useRef } from "react";
import { fetcher } from "./fetcher";
import { RuqqusUser } from "./types";
import { useRuqqusClient } from "./useRuqqusClient";
import { ClientContextProps, WebAuthContext } from "./ClientContext";

type UserData = ClientContextProps & { user: RuqqusUser };

export function useOnWebviewClear(clear: (user: UserData) => void) {
  const client = useRuqqusClient();
  const { authSite, setAuthSite } = useContext(WebAuthContext);
  const lastToken = useRef<string>();

  useEffect(() => {
    if (authSite && client?.access_token) {
      if (client.access_token !== lastToken.current) {
        setAuthSite(undefined);
        lastToken.current = client.access_token;

        const controller = new AbortController();

        fetcher<RuqqusUser>(client.domain, "api/v1/identity", {
          access_token: client.access_token,
          controller,
        }).then((resp) => {
          clear({
            ...client,
            user: resp.body,
          });
        });

        return () => {
          controller.abort();
        };
      }
    }
  }, [client]);
}
