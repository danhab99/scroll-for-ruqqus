import React from 'react';
import {View, Text, TextInput, TextInputProps} from 'react-native';
import Style from '../theme';

type InputProps = {
  label: string;
} & TextInputProps;

export default function Input(props: InputProps) {
  return (
    <View style={props.style}>
      <Text style={Style.inputLabel}>{props.label}</Text>
      <TextInput style={Style.input} {...props} />
    </View>
  );
}
