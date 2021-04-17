import React from "react";
import { Text, TextStyle, View } from "react-native";
import { useTheme } from "@contexts";
import { ThemeInterface } from "contexts/theme/default-theme";

interface TextBoxProps {
  size?: number;
  children: string;
  color?: string;
  style?: TextStyle;
}

export default function TextBox(props: TextBoxProps) {
  const theme = useTheme();

  return (
    <View style={props.style}>
      <Text
        style={{
          color: theme?.Colors?.[props?.color || "text"],
          fontSize: theme?.FontSize.get?.(props.size || 1),
          fontFamily: theme?.Fonts.body,
        }}>
        {props.children}
      </Text>
    </View>
  );
}
