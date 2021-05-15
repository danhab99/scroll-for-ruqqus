import React, { useState, useEffect, createRef } from "react";
import { Text, View, FlatList, RefreshControlComponent } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";
import { useNotifications } from "react-ruqqus";
import { useStyle, useTheme } from "@contexts";
import * as _ from "lodash";

import { StackNavigationProp } from "@react-navigation/stack";
import { NoContent } from "./NoContent";
import { RuqqusNotification } from "../react-ruqqus/types";

function NotificationItem(props: { item: RuqqusNotification }) {
  return <View></View>;
}

export default function Notifications() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();
  const style = useStyle();
  const theme = useTheme();
  const { loading, body, refresh } = useNotifications();

  return (
    <View style={style?.root}>
      <FlatList
        data={body || []}
        renderItem={({ item }) => <NotificationItem item={item} />}
        ListEmptyComponent={<NoContent message="No new notifications" />}
        refreshControl={
          <RefreshControlComponent
            refreshing={loading}
            onRefresh={() => refresh()}
          />
        }
      />
    </View>
  );
}
