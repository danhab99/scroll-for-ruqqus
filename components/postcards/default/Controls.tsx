import React from "react";
import { useContextPost, useVote } from "@react-ruqqus";
import { View } from "react-native";
import { useTheme, useStyle, useSavedPosts } from "@contexts";
import * as _ from "lodash";
import { IconButton } from "components/Buttons";
import { useNavigation } from "@react-navigation/core";
import { usePostMenuContext } from "contexts/PostMenuContext";
import { LoadingControl } from "../../LoadingControl";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRoute } from "@react-navigation/native";
import { useSaved } from "../useSaved";

interface ControlProps {
  additionalControls?: React.ReactNode;
}

export function Controls(props: ControlProps) {
  const { upvote, downvote } = useVote();
  const post = useContextPost();
  const style = useStyle();
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const [saved, toggleSaved] = useSaved();

  const [__, setPostMenu] = usePostMenuContext();

  const predicate = (x: { id: string; date_saved: Date }): boolean =>
    x.id.includes(post.id);

  return (
    <View style={style?.controlrow}>
      <LoadingControl
        name="arrow-upward"
        onPress={() => upvote()}
        highlighted={post.voted === 1}
      />
      <LoadingControl
        name="arrow-downward"
        onPress={() => downvote()}
        highlighted={post.voted === -1}
      />
      <IconButton
        name="save"
        color={saved ? theme?.Colors.primary : theme?.Colors.text}
        onPress={() => toggleSaved()}
      />
      <IconButton
        name="comment"
        onPress={() =>
          navigation.push("Comments", {
            post_id: post.id,
            lastRoute: route.name,
          })
        }
      />
      {props.additionalControls}
      <IconButton name="more-vert" onPress={() => setPostMenu(post)} />
    </View>
  );
}
