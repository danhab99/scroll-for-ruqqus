import {useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {ActivityIndicator, View, Alert} from 'react-native';
import WebView from 'react-native-webview';
import {useRuqqusClient} from '@react-ruqqus';
import {useStyle, useTheme} from '@contexts';

export default function Comments() {
  const route = useRoute<any>();
  const client = useRuqqusClient();
  const style = useStyle();
  const theme = useTheme();

  useEffect(() => {
    Alert.alert(
      'Sorry',
      "We're gonna have to use the webapp while we wait for the Ruqqus maintainers to implement a comments api. If you find this message annoying, please ask the maintainers to implement a comments api.",
    );
  }, []);

  return (
    <WebView
      style={style?.view}
      source={{
        uri: `https://${client.domain}/post/${route?.params?.post_id}`,
      }}
      renderLoading={() => (
        <View
          style={{
            position: 'absolute',
            top: 0,
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: theme?.Space.get?.(1),
          }}>
          <ActivityIndicator color={theme?.Colors.primary} size="large" />
        </View>
      )}
      javaScriptEnabled
      startInLoadingState
      domStorageEnabled
    />
  );
}
