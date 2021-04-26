import React from "react";
import { useContextPost } from "@react-ruqqus";
import { View, Text } from "react-native";
import { useStyle } from "@contexts";
import { decode } from "html-entities";

export function Title() {
  const post = useContextPost();
  const style = useStyle();

  return (
    <View>
      <Text style={style?.title}>{decode(post.title)}</Text>
    </View>
  );
}
