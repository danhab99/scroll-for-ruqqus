import React, {useContext, useRef} from 'react';
import {ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import {UserContext, WebAuthContext} from './ClientContext';

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
