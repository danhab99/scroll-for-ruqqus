import { fetcher, RuqqusFeed } from "@react-ruqqus";
import { CardSelector } from "components/postcards/cardSelector";
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { PopupWrapper } from "./PopupWrapper";
import { useRoute } from "@react-navigation/core";
import { useTheme, useStyle, useSavedPosts } from "@contexts";
import { RuqqusPost, useRuqqusClient, PostContext } from "react-ruqqus";
import _ from "lodash";
import TextBox from "../components/TextBox";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NoContent } from "./NoContent";
import { useGetter } from "../contexts/RealmContext";
import { IRealmSavedPost } from "../contexts/realm/savedPosts";

function PostResolver(props: { postID: string }) {
  const [post, setPost] = useState<RuqqusPost>();
  const client = useRuqqusClient();

  useEffect(() => {
    fetcher<RuqqusPost>(client.domain, `api/v1/post/${props.postID}`, {
      access_token: client.access_token,
    }).then((resp) => setPost(resp.body as RuqqusPost));
  });

  if (post) {
    return (
      <PostContext.Provider value={post}>
        <CardSelector />
      </PostContext.Provider>
    );
  } else {
    return <ActivityIndicator />;
  }
}

export function Saved() {
  const route = useRoute();
  const theme = useTheme();
  const style = useStyle();

  const posts = useGetter<IRealmSavedPost>("saved");

  return (
    <View style={style?.root}>
      <PopupWrapper>
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostResolver postID={item.postID} />}
          // onEndReached={() => nextPage()}
          contentContainerStyle={{ marginTop: theme?.Space.get?.(1) }}
          // refreshControl={<RefreshControl refreshing={loading} />}
          // onEndReachedThreshold={0.1}
          ListEmptyComponent={<NoContent message="No saved posts" />}
        />
      </PopupWrapper>
    </View>
  );
}
