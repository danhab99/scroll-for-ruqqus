import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Style from '../theme';

export default function Input(props) {
  return (<View>
    <Text style={Style.inputLabel}>
      {props.label}
    </Text>
    <TextInput
      style={{
        ...props.style,
        ...Style.input
      }}
      {...props} />
  </View>);
}
