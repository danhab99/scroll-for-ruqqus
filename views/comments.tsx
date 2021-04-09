import {useRoute} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import WebView from 'react-native-webview';
import Style, {COLORS, SPACE} from '../theme';

export default function Comments() {
  const route = useRoute<any>();

  return (
    <WebView
      style={Style.view}
      source={{
        uri: `https://${route?.params?.post?.client?.domain}/post/${route?.params?.post?.id}`,
      }}
      renderLoading={() => (
        <View
          style={{
            position: 'absolute',
            top: 0,
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: SPACE(1),
          }}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      )}
      javaScriptEnabled
      startInLoadingState
      domStorageEnabled
    />
  );
}
