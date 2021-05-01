import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { useStyle } from "@contexts";

type InputProps = {
  label?: string;
} & TextInputProps;

export default function Input(props: InputProps) {
  const style = useStyle();

  return (
    <View style={props.style}>
      {props.label ? (
        <Text style={style?.inputLabel}>{props.label}</Text>
      ) : null}
      <TextInput style={style?.input} {...props} />
    </View>
  );
}
