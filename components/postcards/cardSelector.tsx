import React from "react";
import DefaultPostcard from "./default/postcard";
import { View } from "react-native";
import { useStyle } from "@contexts";

export function CardSelector() {
  const style = useStyle();
  return (
    <View style={style?.paddedCard}>
      <DefaultPostcard />
    </View>
  );
}
