import { useEffect, useRef } from "react";
import { fetcher } from "./fetcher";
import { RuqqusUser } from "./types";
import { useRuqqusClient } from "./useRuqqusClient";
import { ClientContextProps } from "./ClientContext";

type UserData = ClientContextProps & { user: RuqqusUser };

export function useOnWebviewClear(clear: (user: UserData) => void) {
  const client = useRuqqusClient();
  const lastToken = useRef<string>();

  useEffect(() => {
    if (client?.access_token) {
      if (client.access_token !== lastToken.current) {
        lastToken.current = client.access_token;

        const controller = new AbortController();

        fetcher(client.domain, "api/v1/identity", {
          access_token: client.access_token,
          controller,
        }).then((resp) => {
          clear({
            ...client,
            user: resp.body as RuqqusUser,
          });
        });

        return () => {
          controller.abort();
        };
      }
    }
  }, [client]);
}
