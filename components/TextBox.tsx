import React from "react";
import { Text, TextStyle, TextProps } from "react-native";
import { useTheme } from "@contexts";

interface TextBoxProps {
  size?: number;
  children: string | React.ReactNode;
  color?: string;
}

export default function TextBox(props: TextBoxProps & Partial<TextProps>) {
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          color: theme?.Colors?.[props?.color || "text"],
          fontSize: theme?.FontSize.get?.(props.size || 1),
          fontFamily: theme?.Fonts.body,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        },
        props.style,
      ]}
      {...props}>
      {props.children}
    </Text>
  );
}
