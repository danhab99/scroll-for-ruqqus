import React from "react";
import { Text } from "react-native";
import { useTheme } from "@contexts";

interface BadgeProps {
  text: string;
  fg: string;
  bg: string;
}
export function Badge(props: BadgeProps) {
  const theme = useTheme();

  return (
    <Text
      style={{
        backgroundColor: props.bg,
        color: props.fg,
        fontSize: theme?.FontSize.get?.(0.2),
        padding: 1,
        borderRadius: 5,
        margin: 1,
        textAlign: "center",
      }}>
      {props.text}
    </Text>
  );
}
