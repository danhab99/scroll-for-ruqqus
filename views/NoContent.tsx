import React from "react";
import { View } from "react-native";
import { useTheme } from "@contexts";
import TextBox from "../components/TextBox";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface NoContentProps {
  message: string;
}

export function NoContent(props: NoContentProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        padding: theme?.Space.get?.(5),
      }}>
      <Icon
        name="ghost"
        color={theme?.Colors.muted}
        size={theme?.FontSize.get?.(10)}
        style={{ margin: theme?.Space.get?.(1) }}
      />
      <TextBox color="muted">{props.message}</TextBox>
    </View>
  );
}
