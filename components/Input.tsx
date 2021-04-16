import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { useStyle } from "@contexts";

type InputProps = {
  label: string;
} & TextInputProps;

export default function Input(props: InputProps) {
  const style = useStyle();

  return (
    <View style={props.style}>
      <Text style={style?.inputLabel}>{props.label}</Text>
      <TextInput style={style?.input} {...props} />
    </View>
  );
}
