import React from "react";
import { usePost } from "@react-ruqqus";
import { View, Text, Pressable } from "react-native";
import { useTheme, useStyle } from "@contexts";
import TimeAgo from "react-native-timeago";
import * as _ from "lodash";
import { useNavigation, useRoute } from "@react-navigation/core";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface BadgeProps {
  text: string;
  fg: string;
  bg: string;
}

function Badge(props: BadgeProps) {
  const theme = useTheme();

  return (
    <Text
      style={{
        backgroundColor: props.bg,
        color: props.fg,
        fontSize: theme?.FontSize.get?.(0.2),
        padding: 1,
        borderRadius: 5,
        marginRight: 5,
      }}>
      {props.text}
    </Text>
  );
}

function MiniIcon(props: { name: string }) {
  return (
    <Icon
      name={props.name}
      size={20}
      color="white"
      style={{ marginRight: 5 }}
    />
  );
}

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
      label: <TimeAgo time={post?.created_utc * 1000} />,
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

  return (
    <View>
      <View style={style?.horizontal}>{head}</View>
      <View style={style?.horizontal}>
        {post.is_archived ? <MiniIcon name="archive" /> : null}
        {post.is_banned ? <MiniIcon name="block-helper" /> : null}
        {post.is_bot ? <MiniIcon name="robot" /> : null}
        {post.is_deleted ? <MiniIcon name="trash-can" /> : null}
        {post.is_nsfl ? <Badge text="NSFL" fg="white" bg="black" /> : null}
        {post.is_nsfw ? <Badge text="NSFW" fg="white" bg="red" /> : null}
        {post.is_offensive ? (
          <Badge text="OFFENSIVE" fg="black" bg="orange" />
        ) : null}
      </View>
    </View>
  );
}
