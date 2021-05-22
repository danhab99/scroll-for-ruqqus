import React from "react";
import { View } from "react-native";
import { RuqqusFlagged } from "@react-ruqqus";
import { MiniIcon } from "./MiniIcon";
import { Badge } from "./MiniBadge";
import { useStyle } from "@contexts";

export function RuqqusBadges(props: RuqqusFlagged) {
  const style = useStyle();
  return (
    <View style={style?.horizontal}>
      {props.is_pinned ? <MiniIcon name="pin" /> : null}
      {props.is_archived ? <MiniIcon name="archive" /> : null}
      {props.is_banned ? <MiniIcon name="block-helper" /> : null}
      {props.is_bot ? <MiniIcon name="robot" /> : null}
      {props.is_deleted ? <MiniIcon name="trash-can" /> : null}
      {props.is_nsfl ? <Badge text="NSFL" fg="white" bg="black" /> : null}
      {props.is_nsfw ? <Badge text="NSFW" fg="white" bg="red" /> : null}
      {props.is_offensive ? (
        <Badge text="OFFENSIVE" fg="black" bg="orange" />
      ) : null}
    </View>
  );
}
