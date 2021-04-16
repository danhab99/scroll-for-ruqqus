import { fetcher, RuqqusFeed } from "@react-ruqqus";
import { CardSelector } from "components/postcards/cardSelector";
import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { PopupWrapper } from "./PopupWrapper";
import { useRoute } from "@react-navigation/core";
import { useTheme, useStyle } from "@contexts";
import { useSavedPosts } from "../contexts/useCollection";
import { RuqqusPost, useRuqqusClient, PostContext } from "react-ruqqus";
import _ from "lodash";

export function Saved() {
  const route = useRoute();
  const theme = useTheme();
  const style = useStyle();

  const [saves, { nextPage }] = useSavedPosts();
  const [posts, setPosts] = useState<RuqqusPost[]>();
  const [loading, setLoading] = useState(false);

  const client = useRuqqusClient();

  useEffect(() => {
    let f = async () => {
      setLoading(true);
      for (const sav of saves) {
        if (!(_.findIndex(posts, (x) => x.id === sav.id) >= 0)) {
          let resp = await fetcher(client.domain, `api/v1/post/${sav.id}`, {
            access_token: client.access_token,
          });
          if (resp.ok) {
            let newPost: RuqqusPost = resp.body;
            setPosts((prev) => (prev ? prev.concat([newPost]) : [newPost]));
          }
        }
      }
      setLoading(false);
    };
    f();
  }, [saves]);

  return (
    <View style={style?.root}>
      <PopupWrapper>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostContext.Provider value={item}>
              <CardSelector />
            </PostContext.Provider>
          )}
          onEndReached={() => nextPage()}
          contentContainerStyle={{ marginTop: theme?.Space.get?.(1) }}
          refreshControl={<RefreshControl refreshing={loading} />}
          onEndReachedThreshold={0.1}
        />
      </PopupWrapper>
    </View>
  );
}
