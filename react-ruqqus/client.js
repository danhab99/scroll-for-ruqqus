import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
} from 'react';
import {ActivityIndicator, View, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';

const ClientContext = createContext();
const UserContext = createContext();
const AuthErrorContext = createContext();
const WebAuthContext = createContext();

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

function useRuqqusClient() {
  return useContext(ClientContext);
}

export function useFetch(host, edge, opts) {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState();
  const [body, setBody] = useState(opts?.initial);

  useEffect(() => {
    setLoading(true);
    fetcher(host, edge, opts).then((d) => {
      setResp(d);
      setBody(d?.body);
      setLoading(false);
    });
  }, [opts?.body, ...Object.values(opts?.args || {})]);

  return {loading, resp, body};
}

export function useSumbitter(edge, body) {
  const client = useRuqqusClient();
}

function fetcher(host, edge, {args, body, access_token} = {}) {
  var a = Object.entries(args || {})
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  let reqbody = Object.entries(body || {}).map(
    ([key, value]) => `${key}=${value}`,
  );
  reqbody = reqbody.join('&');

  return fetch(`https://${host}/${edge}${a ? '?' : ''}${a}`, {
    method: body ? 'POST' : 'GET',
    body: reqbody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-User-Type': 'App',
      'X-Library': 'react-ruqqus',
      'X-Supports': 'auth',
      'User-Agent': `scroll-for-ruqqus`,
      Authorization: `Bearer ${access_token}`,
    },
    redirect: 'manual',
  })
    .then(async (r) => {
      return {
        ...r,
        body: await (r.headers.get('content-type').includes('json')
          ? r.json()
          : r.text()),
      };
    })
    .then((r) => {
      if (r.ok) {
        return r;
      } else if (
        r?.body?.error == '401 Not Authorized. Invalid or Expired Token'
      ) {
        throw new Error('Login error');
      } else {
        throw new Error('Client error', r);
      }
    });
}

function useRuqqusFetch(edge, opts) {
  const client = useRuqqusClient();
  return useFetch(client.domain, edge, opts);
}

export function useAuthSites() {
  const client = useRuqqusClient();
  const {setAuthSite} = useContext(WebAuthContext);
  const {loading, body} = useFetch(client.authserver, 'sites');

  const getAuthURL = (id) => {
    return fetcher(client.authserver, `auth/${id}`).then((resp) => {
      setAuthSite(resp.url);
      return resp.url;
    });
  };

  return {loading, sites: body, getAuthURL};
}

const CAPTURE_TOKENS = `
window.ReactNativeWebView.postMessage(document.body.innerText)
`;

export function AuthSiteWebview(props) {
  const {authSite} = useContext(WebAuthContext);
  const {setTokens} = useContext(UserContext);

  const webViewRef = useRef();
  const tokenLock = useRef(false);

  const catchTokens = (msg) => {
    console.log('WEBVIEW', msg);
    let data = msg.nativeEvent.data;

    if (!tokenLock.current) {
      try {
        data = JSON.parse(data);

        if (data['access_token']) {
          console.log('TOKENS', data);
          setTokens(data);
        }
      } catch (e) {
        console.warn('UNABLE TO CATCH TOKEN', e);
      }
    }
  };
  return (
    <WebView
      ref={webViewRef}
      source={{uri: authSite}}
      injectedJavaScript={CAPTURE_TOKENS}
      injectJavaScript={CAPTURE_TOKENS}
      onMessage={(msg) => catchTokens(msg)}
      onNavigationStateChange={() => {
        webViewRef.current.injectJavaScript(CAPTURE_TOKENS);
      }}
      renderLoading={() => (
        <ActivityIndicator
          size={props.loadingSize || 'large'}
          color={props.loadingColor}
        />
      )}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      scalesPageToFit={true}
      originWhitelist={['*']}
    />
  );
}

export function useOnWebviewClear(clear) {
  const client = useRuqqusClient();

  useEffect(() => {
    if (client.access_token) {
      debugger;
      clear();
    }
  }, [client]);
}

export function useFeed(edge, args) {
  const [posts, setPosts] = useState();
  const [page, setPage] = useState(1);

  const {loading, data} = useRuqqusFetch(`/api/v1/${edge}/listing`, {
    ...args,
    page,
  });

  useEffect(() => {
    if (data) {
      setPosts((prev) => (page > 1 ? prev.concat(data) : data));
    }
  }, [page]);

  return {loading, posts, nextPage: setPage((x) => x + 1)};
}

export function useFrontpage() {
  return useApi('frontpage');
}

export function useAll() {
  return useApi('all');
}
