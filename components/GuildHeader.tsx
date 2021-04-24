import { useGuild } from "@react-ruqqus";
import React from "react";
import { View, Image, Text } from "react-native";
import { COLORS, FONTSIZE, SPACE } from "../theme";
import { Button } from "./Buttons";
import HtmlMarkdown from "./HtmlMarkdown";
import { useStyle, useTheme } from "@contexts";

export function GuildHeader() {
  const guild = useGuild();
  const theme = useTheme();

  if (guild) {
    return (
      <View
        style={{
          backgroundColor: theme?.Colors.background,
          marginBottom: theme?.Space.get?.(1.5),
        }}>
        <Image
          source={{ uri: guild.banner_url }}
          style={{
            width: "100%",
            height: "250px",
            resizeMode: "contain",
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}>
          <Image
            source={{ uri: guild.profile_url }}
            style={{
              width: 64,
              aspectRatio: 1,
              borderRadius: 100,
              margin: theme?.Space.get?.(1),
            }}
          />
          <View style={{ margin: theme?.Space.get?.(1) }}>
            <Text
              style={{
                color: theme?.Colors.text,
                fontSize: theme?.FontSize.get?.(4 / 3),
                fontWeight: "bold",
              }}>
              +{guild.name}
            </Text>
            <Text
              style={{
                color: theme?.Colors.text,
                flexShrink: 1,
              }}>
              {guild.subscriber_count} subscribers
            </Text>
          </View>
        </View>
        {/* <Button text="Subscribe" /> */}
        <HtmlMarkdown html={guild.description_html} />
      </View>
    );
  } else {
    return <View></View>;
  }
}
