import React, { useEffect } from "react";
import { View, Pressable, Text } from "react-native";
import { OptionalEventHandler } from "./OptionalEventHandler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { IconButtonProps } from "react-native-vector-icons/Icon";
import { useTheme } from "@contexts";

export function IconButton(props: IconButtonProps) {
  const theme = useTheme();

  return (
    <Icon.Button
      backgroundColor={
        props.style?.backgroundColor || theme?.Colors.backgroundHighlight
      }
      size={theme?.FontSize?.get?.(3)}
      {...props}
    />
  );
}

interface ButtonProps {
  disabled?: boolean;
  onPress?: OptionalEventHandler;
  text?: string;
  style?: object;
}

export function Button(props: ButtonProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={() => !props.disabled && props?.onPress?.()}>
      <Text
        style={{
          backgroundColor: props.disabled
            ? theme?.Colors?.muted
            : theme?.Colors?.primary,
          color: theme?.Colors?.text,
          justifyContent: "center",
          textAlign: "center",
          fontSize: theme?.FontSize?.get?.(1.5),
          padding: theme?.Space?.get?.(0.5),
          borderRadius: 5,
          ...props.style,
        }}>
        {props.text}
      </Text>
    </Pressable>
  );
}
