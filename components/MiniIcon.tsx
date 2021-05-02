import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function MiniIcon(props: { name: string }) {
  return (
    <Icon
      name={props.name}
      size={20}
      color="white"
      style={{ marginRight: 5 }}
    />
  );
}
