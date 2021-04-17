import { useUser } from "@react-ruqqus";
import React from "react";
import { View, Image, Text } from "react-native";
import Style, { COLORS, FONTSIZE, SPACE } from "../theme";
import { Button } from "./Buttons";
import HtmlMarkdown from "./HtmlMarkdown";
import { useStyle, useTheme } from "@contexts";
import { useRuqqusClient } from "../react-ruqqus/useRuqqusClient";

interface GuildHeaderProps {
  guild: {
    banner_url: string;
    icon_url: string;
    name: string;
    subscribers: number;
    description: {
      html: string;
    };
  };
  enabled: boolean;
}

export function UserHeader(props?: GuildHeaderProps) {
  const user = useUser();
  const theme = useTheme();
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
          <Image
            source={{ uri: user.profile_url }}
            style={{
              width: 64,
              aspectRatio: 1,
              margin: theme?.Space.get?.(1),
              borderRadius: 4,
            }}
          />
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
