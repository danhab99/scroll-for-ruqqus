import React, { useState, useEffect, createRef } from "react";
import { Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";
import { RuqqusFeed } from "react-ruqqus";
import { useValue, useStyle, useTheme } from "@contexts";
import * as _ from "lodash";

import { GuildHeader } from "../components/GuildHeader";
import { UserHeader } from "../components/UserHeader";
import { Button, IconButton } from "components/Buttons";
import Popup, { PopupButton } from "components/Popup";
import { CardSelector } from "../components/postcards/cardSelector";
import { PopupWrapper } from "./PopupWrapper";
import { useEnforceLogin } from "./useEnforceLogin";
import Input from "components/Input";

export default function Feed() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const style = useStyle();
  const theme = useTheme();

  const [sortPopupVisible, setSortPopupVisible] = useState(false);
  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const [sort, setSort] = useState("hot");
  const [navigate, setNavigate] = useState<string>("");

  const refreshRef = createRef<() => void>();

  useEnforceLogin();

  useEffect(() => {
    let feed = route.params.feed;
    if (typeof feed === "object") {
      if ("user" in feed) {
        navigation.setOptions({
          title: `@${feed.user}`,
        });
      } else if ("guild" in feed) {
        navigation.setOptions({
          title: `+${feed.guild}`,
        });
      }
    } else {
      navigation.setOptions({
        title: `${feed[0].toUpperCase()}${feed.slice(1)}`,
      });
    }

    navigation.setOptions({
      headerRight: () => (
        <View style={{ display: "flex", flexDirection: "row" }}>
          <IconButton name="refresh" onPress={() => refreshRef?.current?.()} />
          <IconButton
            name="sort-amount-desc"
            onPress={() => setSortPopupVisible(true)}
          />
          <IconButton
            name="location-arrow"
            onPress={() => setNavigatorVisible(true)}
          />
        </View>
      ),
    });
  }, []);

  const doSetSort = (x: string) => () => {
    setSort(x);
    setSortPopupVisible(false);
  };

  const goto = () => {
    let target = {
      "+": "guild",
      "@": "user",
    }[navigate[0]];

    navigation.push(route.name, {
      feed: {
        [target]: navigate.slice(1),
      },
    });
    setNavigate("");
    setNavigatorVisible(false);
  };

  return (
    <View>
      <Popup
        visible={sortPopupVisible}
        toggleModal={() => setSortPopupVisible((x) => !x)}
        title="Sort">
        <PopupButton icon="fire" label="Hot" onPress={doSetSort("hot")} />
        <PopupButton
          icon="arrow-circle-o-up"
          label="Top"
          onPress={doSetSort("top")}
        />
        <PopupButton icon="star" label="New" onPress={doSetSort("new")} />
        <PopupButton
          icon="bullhorn"
          label="disputed"
          onPress={doSetSort("disputed")}
        />
        <PopupButton
          icon="wechat"
          label="activity"
          onPress={doSetSort("activity")}
        />
      </Popup>

      <Popup
        title="Goto"
        visible={navigatorVisible}
        toggleModal={() => setNavigatorVisible((x) => !x)}>
        <Input
          label="Goto +guild or @user"
          autoCapitalize="none"
          autoCompleteType="off"
          value={navigate}
          onChangeText={(e) => setNavigate(e)}
        />
        <View
          style={{
            marginTop: theme?.Space.get?.(1),
          }}>
          <Button
            text="Go"
            disabled={!(navigate[0] === "+" || navigate[0] === "@")}
            onPress={() => goto()}
          />
        </View>
      </Popup>

      <PopupWrapper>
        <RuqqusFeed
          feed={route.params.feed}
          renderPost={() => <CardSelector />}
          renderGuildHeader={() => <GuildHeader />}
          renderUserHeader={() => <UserHeader />}
          style={style?.root}
          contentContainerStyle={{
            marginTop:
              typeof route.params.feed === "object" ? 0 : theme?.Space.get?.(1),
          }}
          refreshRef={refreshRef}
          sort={sort}
        />
      </PopupWrapper>
    </View>
  );
}
