import {createContext} from 'react';
import {TokenInterface} from './RuqqusClientProvider';

class SetOutOfContetStateError extends Error {}

export interface ClientContextProps {
  authserver: string;
  access_token: string;
  refresh_token: string;
  client_id: string;
  expires_at: number;
  domain: string;
  siteID: string;
  username: string;
}

export const ClientContext = createContext<ClientContextProps>(
  {} as ClientContextProps,
);

interface UserContextProps {
  setTokens: (token: string) => void;
}

type UserContextType = React.Dispatch<
  React.SetStateAction<TokenInterface | undefined>
>;

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

interface AuthErrorContextProps {}

export const AuthErrorContext = createContext<AuthErrorContextProps>(
  {} as AuthErrorContextProps,
);

interface WebAuthContextProps {
  authSite: string | undefined;
  setAuthSite: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const WebAuthContext = createContext<WebAuthContextProps>({
  authSite: '',
  setAuthSite: (value: React.SetStateAction<string | undefined>) => {
    throw new SetOutOfContetStateError();
  },
});
