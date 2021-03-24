import React from 'react';
import {Text, Linking} from 'react-native';
import {COLORS, Lighten} from '../theme';

export default function LinkText(props) {
  return (
    <Text
      style={{
        color: Lighten(COLORS.primary),
        textDecorationColor: COLORS.primary,
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
        ...props.style,
      }}
      onPress={() => Linking.openURL(props.url)}>
      {props.children}
    </Text>
  );
}
