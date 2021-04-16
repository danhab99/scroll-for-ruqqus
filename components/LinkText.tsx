import React from "react";
import { Text, Linking } from "react-native";
import { COLORS, Lighten } from "../theme";

interface LinkTextProps {
  style?: object;
  url: string;
  children: string;
}

export default function LinkText(props: LinkTextProps) {
  return (
    <Text
      style={{
        color: Lighten(COLORS.primary),
        textDecorationColor: COLORS.primary,
        textDecorationStyle: "solid",
        textDecorationLine: "underline",
        ...props.style,
      }}
      onPress={() => Linking.openURL(props.url)}>
      {props.children}
    </Text>
  );
}
