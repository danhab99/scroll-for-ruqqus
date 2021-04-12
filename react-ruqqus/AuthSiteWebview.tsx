import React, {useContext, useRef} from 'react';
import {ActivityIndicator} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {UserContext, WebAuthContext} from './ClientContext';

const CAPTURE_TOKENS = `
window.ReactNativeWebView.postMessage(document.body.innerText)
`;

export function AuthSiteWebview() {
  const {authSite} = useContext(WebAuthContext);
  const setTokens = useContext(UserContext);

  const webViewRef = useRef<any>();
  const tokenLock = useRef(false);

  const catchTokens = (msg: WebViewMessageEvent) => {
    console.log('WEBVIEW', msg);
    let data = msg.nativeEvent.data;

    if (!tokenLock.current) {
      try {
        let parsed: any = JSON.parse(data);

        if (parsed['access_token']) {
          console.log('TOKENS', parsed);
          setTokens(parsed);
        }
      } catch (e) {
        console.warn('UNABLE TO CATCH TOKEN', e);
      }
    }
  };
  return (
    <WebView
      ref={webViewRef}
      source={{uri: authSite || ''}}
      injectedJavaScript={CAPTURE_TOKENS}
      injectJavaScript={CAPTURE_TOKENS}
      onMessage={(msg) => catchTokens(msg)}
      onNavigationStateChange={() => {
        webViewRef.current.injectJavaScript(CAPTURE_TOKENS);
      }}
      renderLoading={() => <ActivityIndicator size="large" />}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      scalesPageToFit={true}
      originWhitelist={['*']}
    />
  );
}
