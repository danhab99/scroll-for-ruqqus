import React from "react";
import { usePost } from "@react-ruqqus";
import { View, Text, Pressable } from "react-native";
import { useTheme, useStyle } from "@contexts";
import TimeAgo from "react-native-timeago";
import * as _ from "lodash";
import { useNavigation, useRoute } from "@react-navigation/core";

export function Head() {
  const post = usePost();
  const theme = useTheme();
  const style = useStyle();
  const navigation = useNavigation();
  const route = useRoute();

  const headItems = [
    {
      label: "+" + post.guild.name,
      action: () =>
        navigation.push(route.name, { feed: { guild: post.guild_name } }),
    },
    {
      label: post.author_name,
      action: () =>
        navigation.push(route.name, { feed: { user: post.author_name } }),
    },
    {
      label: post.domain,
    },
    {
      label: <TimeAgo time={post?.created_utc?.getSeconds?.()} hideAgo />,
    },
    {
      label: post.id,
    },
  ];

  const headComponents = headItems.map((obj, i) => (
    <Pressable onPress={obj.action}>
      <Text style={i === 0 ? style?.primaryHeadText : style?.headText}>
        {obj.label}
      </Text>
    </Pressable>
  ));

  const head = _.flatMap(headComponents, (value, index, array) =>
    array.length - 1 !== index
      ? [value, <Text style={style?.headBullet}>{" • "}</Text>]
      : value,
  );

  return <View style={style?.horizontal}>{head}</View>;
}
