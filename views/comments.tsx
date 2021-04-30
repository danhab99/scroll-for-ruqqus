import { useRoute } from "@react-navigation/native";
import React, { useEffect, useContext, createContext } from "react";
import {
  ActivityIndicator,
  View,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import WebView from "react-native-webview";
import {
  PostContext,
  useRuqqusClient,
  usePost,
  RuqqusComment,
} from "@react-ruqqus";
import { useStyle, useTheme, useValue } from "@contexts";
import { CardSelector } from "components/postcards/cardSelector";
import { PopupWrapper } from "./PopupWrapper";
import TextBox from "components/TextBox";
import HtmlMarkdown from "components/HtmlMarkdown";

const DepthContext = createContext(0);

function Reply({ reply }: { reply: RuqqusComment }) {
  const depth = useContext(DepthContext);
  const theme = useTheme();

  const SPACER = 2;

  return (
    <DepthContext.Provider value={depth + 1}>
      <View
        style={{
          borderLeftColor: theme?.Colors.primary,
          borderLeftWidth: SPACER,
          marginLeft: 2 * SPACER * depth,
          marginBottom: 2 * SPACER,
        }}>
        <HtmlMarkdown html={reply.body_html} />

        {reply.replies.map((reply) => (
          <Reply reply={reply} />
        ))}
      </View>
    </DepthContext.Provider>
  );
}

export default function Comments() {
  const route = useRoute<any>();
  const client = useRuqqusClient();
  const style = useStyle();
  const theme = useTheme();
  const { loading, body, refresh } = usePost(route.params.post_id);

  return (
    <ScrollView
      style={style?.root}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => refresh()} />
      }>
      {!loading && body ? (
        <PostContext.Provider value={body}>
          <PopupWrapper>
            <CardSelector />
          </PopupWrapper>
        </PostContext.Provider>
      ) : null}

      {body?.replies.map((reply) => (
        <Reply reply={reply} />
      ))}
    </ScrollView>
  );
}
