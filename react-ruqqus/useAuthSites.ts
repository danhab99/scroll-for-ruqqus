import { useContext } from "react";
import { WebAuthContext } from "./ClientContext";
import { fetcher } from "./fetcher";
import { useFetch } from "./useFetch";
import { useRuqqusClient } from "./useRuqqusClient";

interface AuthSite {
  _id: string;
  clientID: string;
  domain: string;
  name: string;
}

export function useAuthSites() {
  const client = useRuqqusClient();
  const { setAuthSite } = useContext(WebAuthContext);
  const { loading, body, refresh } = useFetch<AuthSite[]>(
    client?.authserver || "",
    "sites",
  );

  const getAuthURL = (id: string) => {
    if (client?.authserver) {
      return fetcher(client.authserver, `auth/${id}`).then((resp) => {
        setAuthSite(resp.url);
        return resp.url;
      });
    } else {
      throw new Error("No auth server specified");
    }
  };

  return { loading, sites: body, getAuthURL, refresh };
}
