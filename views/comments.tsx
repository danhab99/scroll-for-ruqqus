import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useContext, createContext, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Pressable,
  ToastAndroid,
} from "react-native";
import {
  PostContext,
  useRuqqusClient,
  usePost,
  RuqqusComment,
  fetcher,
  useContextPost,
  RuqqusPost,
} from "@react-ruqqus";
import { useStyle, useTheme, useValue } from "@contexts";
import { PopupWrapper } from "./PopupWrapper";
import TextBox from "components/TextBox";
import HtmlMarkdown from "components/HtmlMarkdown";
import TimeAgo from "react-native-timeago";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, IconButton } from "components/Buttons";
import { LoadingControl } from "components/LoadingControl";
import Popup from "components/Popup";
import Input from "components/Input";
import Color from "color";
import { StackNavigationProp } from "@react-navigation/stack";
import DefaultPostcard from "components/postcards/default/postcard";
import { NoContent } from "./NoContent";

const DepthContext = createContext(0);
const RefreshContext = createContext<() => void>(() => {});
const PostReplyContext = createContext<
  React.Dispatch<React.SetStateAction<string>>
>({} as React.Dispatch<React.SetStateAction<string>>);

interface PostReplyContextProviderProps {
  post: RuqqusPost;
}

const CHARACTER_LIMIT = 10000;

function PostReplyContextProvider({
  post,
  children,
}: React.PropsWithChildren<PostReplyContextProviderProps>) {
  const theme = useTheme();
  const client = useRuqqusClient();
  const refresh = useContext(RefreshContext);

  const [replyID, setReplyID] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => console.log("COMMENTS REPLY ID", replyID), [replyID]);

  const postReply = () => {
    const id = `${replyID}`;
    setReplyID("");

    fetcher(client.domain, `api/v1/comment`, {
      access_token: client.access_token,
      body: {
        parent_fullname: id,
        body: replyMessage,
      },
    })
      .then((resp) => {
        if (resp.ok) {
          ToastAndroid.show("Comment successfully posted", ToastAndroid.SHORT);
          refresh();
        } else {
          resp.text().then((errMsg) => {
            ToastAndroid.show("Comment failed: " + errMsg, ToastAndroid.LONG);
          });
          console.warn("CANNOT COMMENT", resp);
        }
      })
      .catch((e) => {
        ToastAndroid.show("Commenting Error: " + e.message, ToastAndroid.LONG);
      });
  };

  return (
    <PostReplyContext.Provider value={setReplyID}>
      <Popup
        title="Reply"
        visible={replyID ? true : false}
        toggleModal={() => setReplyID("")}>
        <Input
          label={`${CHARACTER_LIMIT - replyMessage.length} characters left`}
          onChangeText={(t) => setReplyMessage(t)}
          value={replyMessage}
        />
        <Button
          text="Post reply"
          disabled={
            replyMessage.length > 0 && replyMessage.length <= CHARACTER_LIMIT
          }
          onPress={() => postReply()}
          style={{
            marginTop: theme?.Space.get?.(1),
          }}
        />
      </Popup>

      {children}
    </PostReplyContext.Provider>
  );
}

function Deliminer() {
  const style = useStyle();
  return <TextBox style={style?.headBullet}>{" • "}</TextBox>;
}

function Reply({ reply }: { reply: RuqqusComment }) {
  const depth = useContext(DepthContext);
  const theme = useTheme();
  const style = useStyle();
  const client = useRuqqusClient();
  const post = useContextPost();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const refresh = useContext(RefreshContext);
  const startPostReply = useContext(PostReplyContext);

  const [controlsVisible, setControlVisible] = useState(false);
  const [childRepliesVisible, setChildRepliesVisible] = useState(true);

  const SPACER = 4;

  const depthColor = Color([255, 0, 0])
    .rotate((360 / 8) * depth)
    .hex();

  const vote = (dir: -1 | 1) => {
    return fetcher(client.domain, `api/v1/vote/comment/${reply.id}/${dir}`, {
      access_token: client.access_token,
      body: {},
    }).then((resp) => {
      if (resp.ok) {
        refresh();
      } else {
        console.warn("CANNOT VOTE", resp);
      }
    });
  };

  return (
    <DepthContext.Provider value={depth + 1}>
      <View
        style={{
          borderLeftColor: depthColor,
          borderLeftWidth: SPACER,
          marginTop: SPACER,
          marginLeft: 1,
        }}>
        <Pressable
          onPress={() => setControlVisible((x) => !x)}
          onLongPress={() => setChildRepliesVisible((x) => !x)}>
          <View style={{ marginLeft: theme?.Space.get?.(0.5) }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}>
              <Pressable
                onPress={() =>
                  navigation.push(route.params?.lastRoute, {
                    feed: { user: reply.author_name },
                  })
                }>
                <TextBox size={0.6} color="primary">
                  @{reply.author_name}
                </TextBox>
              </Pressable>
              <Deliminer />
              <TextBox size={0.6} color="muted">
                <TimeAgo time={reply.created_utc * 1000} />
              </TextBox>
              <Deliminer />
              <TextBox size={0.6} color="muted">
                {reply.id}
              </TextBox>
              {!childRepliesVisible ? (
                <>
                  <Deliminer />
                  <TextBox size={0.6} color="muted">
                    {reply.replies.length} collapsed comments
                  </TextBox>
                </>
              ) : null}
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

        {controlsVisible ? (
          <View
            style={[
              style?.horizontal,
              {
                backgroundColor: theme?.Colors.backgroundHighlight,
                paddingLeft: theme?.Space.get?.(1),
              },
            ]}>
            <LoadingControl
              name="arrow-upward"
              onPress={() => vote(1)}
              highlighted={false}
            />
            <LoadingControl
              name="arrow-downward"
              onPress={() => vote(-1)}
              highlighted={false}
            />
            <IconButton
              name="reply"
              onPress={() => startPostReply(reply.fullname)}
            />
          </View>
        ) : null}

        {childRepliesVisible &&
          reply.replies.map((reply) => <Reply reply={reply} />)}
      </View>
    </DepthContext.Provider>
  );
}

function ReplyButton() {
  const startPostReply = useContext(PostReplyContext);
  const post = useContextPost();
  return (
    <IconButton name="reply" onPress={() => startPostReply(post.fullname)} />
  );
}

export default function Comments() {
  const route = useRoute<any>();
  const style = useStyle();
  const { loading, body, refresh } = usePost(route.params.post_id);

  return (
    <ScrollView
      style={style?.root}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => refresh()} />
      }>
      {!loading && body ? (
        <PostContext.Provider value={body}>
          <RefreshContext.Provider value={refresh}>
            <PostReplyContextProvider post={body}>
              <PopupWrapper>
                <DefaultPostcard
                  additionalControls={
                    <>
                      <ReplyButton />
                    </>
                  }
                />
              </PopupWrapper>

              {body?.replies?.map?.((reply) => (
                <Reply reply={reply} />
              ))}

              {!body?.replies || body?.replies?.length <= 0 ? (
                <NoContent message="No comments found" />
              ) : null}
            </PostReplyContextProvider>
          </RefreshContext.Provider>
        </PostContext.Provider>
      ) : null}
    </ScrollView>
  );
}
