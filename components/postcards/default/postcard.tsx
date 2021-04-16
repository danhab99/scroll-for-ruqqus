import React from "react";
import { View } from "react-native";
import { useTheme, useStyle } from "@contexts";
import SubmissionContent from "components/PostBody";
import { Head } from "./Head";
import { Title } from "./Title";
import { Metas } from "./Metas";
import { Controls } from "./Controls";

export default function DefaultPostcard() {
  // const post = usePost();
  const theme = useTheme();
  const style = useStyle();

  return (
    <View
      style={{
        marginBottom: theme?.Space.get?.(1),
        marginRight: theme?.Space.get?.(1),
        marginLeft: theme?.Space.get?.(1),
      }}>
      <View style={style?.card}>
        <View style={{ padding: theme?.Space.get?.(0.5) }}>
          <Head />
          <Title />
          <Metas />
        </View>
        <SubmissionContent />
        <Controls />
      </View>
    </View>
  );
}
