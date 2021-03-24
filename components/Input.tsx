import React from 'react';
import {View, Text, TextInput} from 'react-native';
import Style from '../theme';

interface InputProps {
  label: string;
  style: any;
}

export default function Input(props: InputProps) {
  return (
    <View style={props.style}>
      <Text style={Style.inputLabel}>{props.label}</Text>
      <TextInput
        style={Style.input}
        {...(() => {
          let p: any = Object.assign(props, {});
          delete p.style;
          return p;
        })()}
      />
    </View>
  );
}
