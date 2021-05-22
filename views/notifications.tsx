import React, { useState, useEffect, createRef } from "react";
import { Text, View, FlatList, RefreshControl, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useNotifications } from "react-ruqqus";
import { useStyle, useTheme } from "@contexts";
import * as _ from "lodash";
import TimeAgo from "react-native-timeago";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { StackNavigationProp } from "@react-navigation/stack";
import { NoContent } from "./NoContent";
import { RuqqusNotification } from "../react-ruqqus/types";

import TextBox from "../components/TextBox";
import HtmlMarkdown from "../components/HtmlMarkdown";
import { RuqqusBadges } from "components/RuqqusBadges";

function NotificationItem({ item }: { item: RuqqusNotification }) {
  const style = useStyle();
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();

  return (
    <Pressable
      onPress={() =>
        navigation.push("Comments", {
          post_id: item.post.id,
          lastRoute: route.name,
        })
      }>
      <View
        style={[
          style?.card,
          style?.paddedCard,
          {
            padding: theme?.Space.get?.(0.5),
          },
        ]}>
        <TextBox>
          New notification received <TimeAgo time={item.created_utc * 1000} />
        </TextBox>
        <TextBox>
          <TextBox color="primary">@{item.author_name}</TextBox>{" "}
          <Icon name="arrow-right-bold" /> {item.post.id}
        </TextBox>

        <RuqqusBadges {...item} />

        <HtmlMarkdown html={item.body_html} />
      </View>
    </Pressable>
  );
}

export default function Notifications() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const style = useStyle();
  const theme = useTheme();
  const [all, setAll] = useState(false);
  const { loading, body, refresh } = useNotifications(all);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            paddingRight: theme?.Space.get?.(1),
          }}>
          <Pressable onPress={() => setAll((x) => !x)}>
            <TextBox size={2}>
              All{" "}
              <Icon
                size={theme?.FontSize.get?.(2)}
                name={`checkbox-${all ? "marked" : "blank"}`}
              />
            </TextBox>
          </Pressable>
        </View>
      ),
    });
  }, [all]);

  return (
    <View style={style?.root}>
      <FlatList
        data={body?.data || []}
        renderItem={({ item }) => <NotificationItem item={item} />}
        ListEmptyComponent={() => <NoContent message="No new notifications" />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => refresh()} />
        }
        contentContainerStyle={{
          marginTop: theme?.Space.get?.(1),
        }}
      />
    </View>
  );
}
