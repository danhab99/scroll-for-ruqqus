import React from "react";
import { useContextPost } from "@react-ruqqus";
import { View, Text, Pressable } from "react-native";
import { useTheme, useStyle } from "@contexts";
import TimeAgo from "react-native-timeago";
import * as _ from "lodash";
import { useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { RuqqusBadges } from "components/RuqqusBadges";
import TextBox from "components/TextBox";
import { Deliminer } from "components/Deliminer";

export function Head() {
  const post = useContextPost();
  const theme = useTheme();
  const style = useStyle();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const route = useRoute();

  return (
    <View>
      <View style={style?.horizontal}>
        <Pressable
          onPress={() =>
            navigation.push(route.name, { feed: { guild: post.guild_name } })
          }>
          <TextBox color="primary" size={0.6}>
            +{post.guild.name}
          </TextBox>
        </Pressable>

        <Deliminer />

        <Pressable
          onPress={() =>
            navigation.push(route.name, { feed: { user: post.author_name } })
          }>
          <TextBox color="muted" size={0.6}>
            {post.author_name}{" "}
          </TextBox>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.push(route.name, { feed: { user: post.author_name } })
          }>
          <TextBox color={post?.author?.title?.color || "muted"} size={0.6}>
            {post?.author?.title?.text}
          </TextBox>
        </Pressable>

        <Deliminer />

        <TextBox size={0.6} color="muted">
          {post.domain}
        </TextBox>

        <Deliminer />

        <TextBox size={0.6} color="muted">
          <TimeAgo time={post?.created_utc * 1000} />
        </TextBox>

        <Deliminer />

        <TextBox size={0.6} color="muted">
          {post.id}
        </TextBox>
      </View>
      <RuqqusBadges {...post} />
    </View>
  );
}
