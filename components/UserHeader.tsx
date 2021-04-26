import { useContextUser } from "@react-ruqqus";
import React from "react";
import { View, Image, Text } from "react-native";
import HtmlMarkdown from "./HtmlMarkdown";
import { useStyle, useTheme } from "@contexts";
import { useRuqqusClient } from "../react-ruqqus/useRuqqusClient";
import { Badge } from "./MiniBadge";

export function UserHeader() {
  const user = useContextUser();
  const theme = useTheme();
  const style = useStyle();
  const client = useRuqqusClient();

  if (user) {
    return (
      <View style={{ width: "100%" }}>
        <Image
          source={{
            uri: user.banner_url.includes(client.domain)
              ? user.banner_url
              : `https://${client.domain}${user.banner_url}`,
          }}
          style={{
            width: "100%",
            aspectRatio: 3.4092307692307693,
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}>
          <View>
            <Image
              source={{ uri: user.profile_url }}
              style={{
                width: 64,
                aspectRatio: 1,
                margin: theme?.Space.get?.(1),
                borderRadius: 4,
              }}
            />
            <View style={{ padding: theme?.Space.get?.(1) }}>
              {user.is_banned ? (
                <Badge text="BANNED" fg="white" bg="black" />
              ) : null}
              {user.is_premium ? (
                <Badge fg="black" bg="gold" text="Premium" />
              ) : null}
              {user.is_private ? (
                <Badge bg="purple" fg="white" text="Private" />
              ) : null}
            </View>
          </View>
          <View style={{ margin: theme?.Space.get?.(1) }}>
            <Text
              style={{
                color: theme?.Colors.text,
                fontSize: theme?.FontSize.get?.(4 / 3),
                fontWeight: "bold",
              }}>
              {user.username}
            </Text>
            <Text
              style={{
                color: theme?.Colors.text,
                flexShrink: 1,
                fontSize: theme?.FontSize.get?.(1),
              }}>
              Post rep: {user.post_rep}
              {"\n"}
              Comment rep: {user.comment_rep}
            </Text>
            {user.badges.map((badge) => (
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Image
                  source={{ uri: badge.icon_url }}
                  style={{ width: 26, height: 26 }}
                />
                <Text
                  style={{
                    color: theme?.Colors.text,
                    fontSize: theme?.FontSize.get?.(1),
                    overflow: "scroll",
                  }}>
                  {" "}
                  {badge.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <HtmlMarkdown html={user.bio_html} />
      </View>
    );
  } else {
    return <View></View>;
  }
}
