import React, { ReactNode, useState } from "react";
import { Share, View, Linking } from "react-native";
import Popup, { PopupButton } from "components/Popup";
import { RuqqusPost } from "react-ruqqus/types";
import { useNavigation, useRoute } from "@react-navigation/core";
import { PostMenuContext } from "contexts/post-menu-context";

export function PopupWrapper(props: { children: ReactNode }) {
  const navigation = useNavigation();
  const route = useRoute();
  const [menuPost, setMenuPost] = useState<RuqqusPost>();

  return (
    <View>
      {menuPost ? (
        <Popup
          visible={menuPost ? true : false}
          toggleModal={() => setMenuPost(undefined)}
          title="More actions">
          <PopupButton
            label="Share"
            icon="share"
            onPress={() => {
              Share.share({ message: menuPost.url });
              setMenuPost(undefined);
            }}
          />
          <PopupButton
            label="Comments"
            icon="chat"
            onPress={() => {
              navigation.push("Comments", { post_id: menuPost.id });
              setMenuPost(undefined);
            }}
          />
          <PopupButton
            label={`Go to @${menuPost.author_name}`}
            icon="person"
            onPress={() => {
              navigation.push(route.name, {
                feed: { user: menuPost.author_name },
              });
              setMenuPost(undefined);
            }}
          />
          <PopupButton
            label={`Go to +${menuPost.guild_name}`}
            icon="add"
            onPress={() => {
              navigation.push(route.name, {
                feed: { guild: menuPost.guild_name },
              });
              setMenuPost(undefined);
            }}
          />
          <PopupButton
            label="Open In Browser"
            icon="open-in-browser"
            onPress={() => {
              Linking.canOpenURL(menuPost.url).then(() =>
                Linking.openURL(menuPost.url),
              );
              setMenuPost(undefined);
            }}
          />
        </Popup>
      ) : null}

      <PostMenuContext.Provider value={[menuPost, setMenuPost]}>
        {props.children}
      </PostMenuContext.Provider>
    </View>
  );
}
