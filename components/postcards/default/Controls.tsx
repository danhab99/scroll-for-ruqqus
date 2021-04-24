import React from "react";
import { usePost, useVote } from "@react-ruqqus";
import { View } from "react-native";
import { useTheme, useStyle } from "@contexts";
import * as _ from "lodash";
import { IconButton } from "components/Buttons";
import { useSavedPosts } from "../../../contexts/useCollection";
import { useNavigation } from "@react-navigation/core";
import { usePostMenuContext } from "contexts/post-menu-context";
import { LoadingControl } from "./LoadingControlProps";
import { StackNavigationProp } from "@react-navigation/stack";

export function Controls() {
  const { upvote, downvote } = useVote();
  const post = usePost();
  const style = useStyle();
  const theme = useTheme();
  const [saves, { add, remove }] = useSavedPosts();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [__, setPostMenu] = usePostMenuContext();

  const predicate = (x: { id: string; date_saved: Date }): boolean =>
    x.id.includes(post.id);

  const saved = _.findIndex(saves, predicate) >= 0;

  const toggleSaved = () => {
    if (saved) {
      remove(predicate);
    } else {
      add({
        id: post.id,
        date_saved: new Date(),
      });
    }
  };

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
        onPress={() => navigation.push("Comments", { post_id: post.id })}
      />
      <IconButton name="more-vert" onPress={() => setPostMenu(post)} />
    </View>
  );
}
