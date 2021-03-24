import {createContext} from 'react';
import {TokenInterface} from './RuqqusClientProvider';

class SetOutOfContetStateError extends Error {}

interface ClientContextProps {
  authserver: string;
  access_token: string;
  refresh_token: string;
  client_id: string;
  expires_at: number;
  domain: string;
}

export const ClientContext = createContext<ClientContextProps | undefined>(
  undefined,
);

interface UserContextProps {
  setTokens: (token: string) => void;
}

type UserContextType = React.Dispatch<
  React.SetStateAction<TokenInterface | undefined>
>;

export const UserContext = createContext<UserContextType>(
  (value: React.SetStateAction<TokenInterface | undefined>) => {
    throw new SetOutOfContetStateError();
  },
);

interface AuthErrorContextProps {}

export const AuthErrorContext = createContext<
  AuthErrorContextProps | undefined
>(undefined);

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
