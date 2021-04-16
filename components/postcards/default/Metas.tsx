import React from "react";
import { usePost } from "@react-ruqqus";
import { View, Text } from "react-native";
import { useTheme, useStyle } from "@contexts";
import Icon from "react-native-vector-icons/FontAwesome";

export function Metas() {
  const post = usePost();
  const style = useStyle();
  const theme = useTheme();

  return (
    <View style={style?.horizontal}>
      <Icon
        name="arrow-circle-up"
        color={theme?.Colors.primaryLight}
        size={theme?.FontSize.get?.(2)}
      />
      <Text style={style?.upvotes}> {post.upvotes} </Text>
      <Icon
        name="arrow-circle-down"
        color={theme?.Colors.primaryDark}
        size={theme?.FontSize.get?.(2)}
      />
      <Text style={style?.downvotes}> {post.downvotes} </Text>
      <Text style={style?.headText}>
        ({post.score}) • {post.comment_count} comments
      </Text>
    </View>
  );
}
