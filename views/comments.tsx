import { useRoute } from "@react-navigation/native";
import React, { useEffect, useContext, createContext, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Pressable,
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
import TimeAgo from "react-native-timeago";
import Icon from "react-native-vector-icons/FontAwesome";
import { IconButton } from "components/Buttons";
import { LoadingControl } from "components/LoadingControl";

const DepthContext = createContext(0);

function Deliminer() {
  const style = useStyle();
  return <TextBox style={style?.headBullet}>{" • "}</TextBox>;
}

function Reply({ reply }: { reply: RuqqusComment }) {
  const depth = useContext(DepthContext);
  const theme = useTheme();
  const style = useStyle();

  const [visible, setVisible] = useState(false);

  const SPACER = 2;

  return (
    <DepthContext.Provider value={depth + 1}>
      <View
        style={{
          borderLeftColor: theme?.Colors.primary,
          borderLeftWidth: depth ? SPACER : 0,
          marginLeft: 2 * SPACER * depth,
          marginBottom: 2 * SPACER,
        }}>
        <Pressable onPress={() => setVisible((x) => !x)}>
          <View style={{ marginLeft: theme?.Space.get?.(0.5) }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}>
              <TextBox size={0.6} color="primary">
                @{reply.author_name}
              </TextBox>
              <Deliminer />
              <TextBox size={0.6} color="muted">
                <TimeAgo time={reply.created_utc * 1000} />
              </TextBox>
            </View>

            <View style={style?.horizontal}>
              <Icon
                name="arrow-circle-up"
                color={theme?.Colors.primaryLight}
                size={theme?.FontSize.get?.(2)}
              />
              <Text style={style?.upvotes}> {reply.upvotes} </Text>
              <Icon
                name="arrow-circle-down"
                color={theme?.Colors.primaryDark}
                size={theme?.FontSize.get?.(2)}
              />
              <Text style={style?.downvotes}> {reply.downvotes} </Text>
              <Text style={style?.headText}>({reply.score})</Text>
            </View>
          </View>

          <HtmlMarkdown html={reply.body_html} />
        </Pressable>

        {visible ? (
          <View
            style={[
              style?.horizontal,
              {
                backgroundColor: theme?.Colors.backgroundHighlight,
                paddingLeft: theme?.Space.get?.(1),
              },
            ]}>
            <LoadingControl name="arrow-upward" />
            <LoadingControl name="arrow-downward" />
            <IconButton name="reply" />
          </View>
        ) : null}

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
