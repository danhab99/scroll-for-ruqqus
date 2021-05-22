import React from "react";
import { useContextPost } from "@react-ruqqus";
import { View, Text, Pressable } from "react-native";
import { useTheme, useStyle } from "@contexts";
import TimeAgo from "react-native-timeago";
import * as _ from "lodash";
import { useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { RuqqusBadges } from "components/RuqqusBadges";

export function Head() {
  const post = useContextPost();
  const theme = useTheme();
  const style = useStyle();
  const navigation = useNavigation<StackNavigationProp<any>>();

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
      label: <TimeAgo time={post?.created_utc * 1000} />,
    },
    {
      label: post.id,
    },
  ];

  const headComponents = headItems.map((obj, i) => (
    <Pressable key={i} onPress={obj.action}>
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

  return (
    <View>
      <View style={style?.horizontal}>{head}</View>
      <RuqqusBadges {...post} />
    </View>
  );
}
