import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useContext, createContext, useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Pressable,
  ToastAndroid,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  PostContext,
  useRuqqusClient,
  usePost,
  RuqqusComment,
  fetcher,
  RuqqusPost,
  useReplyPoster,
  RuqqusComments,
} from "@react-ruqqus";
import { useStyle, useTheme, useValue } from "@contexts";
import { PopupWrapper } from "./PopupWrapper";
import TextBox from "components/TextBox";
import HtmlMarkdown from "components/HtmlMarkdown";
import TimeAgo from "react-native-timeago";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, IconButton } from "components/Buttons";
import { LoadingControl } from "components/LoadingControl";
import Popup, { PopupProps } from "components/Popup";
import Input from "components/Input";
import Color from "color";
import { StackNavigationProp } from "@react-navigation/stack";
import DefaultPostcard from "components/postcards/default/postcard";
import { NoContent } from "./NoContent";
import { MiniIcon } from "components/MiniIcon";
import { Badge } from "components/MiniBadge";
import _ from "lodash";

const DepthContext = createContext(0);

interface PostReplyContextProviderProps extends Omit<PopupProps, "title"> {
  parent: RuqqusPost | RuqqusComment;
  newReply: (reply: RuqqusComment) => void;
}

const CHARACTER_LIMIT = 10000;

function PostReplyPopup(props: PostReplyContextProviderProps) {
  const theme = useTheme();
  const [replyMessage, setReplyMessage] = useState("");
  const { loading, postReply } = useReplyPoster(props.parent.fullname);

  const post = () =>
    postReply(replyMessage)
      .then((comment) => {
        ToastAndroid.show("Posted a reply", ToastAndroid.SHORT);
        props.newReply(comment);
        props.toggleModal?.();
      })
      .catch((e) => {
        ToastAndroid.show("Comment error: " + e.message, ToastAndroid.LONG);
      });

  return (
    <Popup
      title="Reply"
      visible={props.visible}
      toggleModal={props.toggleModal}>
      <Input
        label={`${CHARACTER_LIMIT - replyMessage.length} characters left`}
        onChangeText={(t) => setReplyMessage(t)}
        value={replyMessage}
      />
      <Button
        text="Post reply"
        disabled={
          !(replyMessage.length > 0 && replyMessage.length <= CHARACTER_LIMIT)
        }
        onPress={() => post()}
        style={{
          marginTop: theme?.Space.get?.(1),
        }}
      />
      {loading ? (
        <ActivityIndicator color={theme?.Colors.primary} size="small" />
      ) : null}
    </Popup>
  );
}

function Deliminer() {
  const style = useStyle();
  return <TextBox style={style?.headBullet}>{" • "}</TextBox>;
}

function Reply(props: { reply: RuqqusComment }) {
  const depth = useContext(DepthContext);
  const theme = useTheme();
  const style = useStyle();
  const client = useRuqqusClient();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<any>();

  const [controlsVisible, setControlVisible] = useState(false);
  const [childRepliesVisible, setChildRepliesVisible] = useState(true);
  const [replies, setReplies] = useState(props?.reply?.replies || []);
  const [reply, setReply] = useState(props.reply);
  const [popupVisible, setPopupVisible] = useState(false);

  const SPACER = 4;

  const depthColor = Color([255, 0, 0])
    .rotate((360.0 / 7.0) * depth)
    .hex();

  const vote = (dir: -1 | 1) => {
    let last = reply.voted;
    let d = last === dir ? 0 : dir;

    return fetcher(client.domain, `api/v1/vote/comment/${reply.id}/${d}`, {
      access_token: client.access_token,
      body: {},
    }).then((resp) => {
      if (resp.ok) {
        setReply((prev) => {
          let c = _.clone(prev);
          let reset = last === dir ? -1 : 1;
          switch (dir) {
            case -1:
              _.set(c, "downvotes", c.downvotes + reset);
            case 1:
              _.set(c, "upvotes", c.upvotes + reset);
          }
          _.set(c, "voted", d);

          return c;
        });
      } else {
        console.warn("CANNOT VOTE", resp);
      }
    });
  };

  const deleted = reply.is_deleted || reply.deleted_utc;

  return (
    <DepthContext.Provider value={depth + 1}>
      <PostReplyPopup
        parent={reply}
        newReply={(comment) =>
          setReplies((prev) => ([] as RuqqusComments).concat([comment], prev))
        }
        visible={popupVisible}
        toggleModal={() => setPopupVisible((x) => !x)}
      />

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
          {deleted ? (
            <View>
              <TextBox
                style={{
                  fontStyle: "italic",
                  marginLeft: theme?.Space.get?.(0.5),
                  color: theme?.Colors.muted,
                }}>
                reply {reply.id} was deleted{" "}
                <TimeAgo time={reply.deleted_utc * 1000} />
              </TextBox>
            </View>
          ) : (
            <>
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
                      <Image
                        source={{
                          uri: `https://ruqqus.com/@${reply.author_name}/pic/profile`,
                        }}
                        style={{
                          width: theme?.FontSize.get?.(1),
                          height: theme?.FontSize.get?.(1),
                        }}
                      />{" "}
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
                  {reply.is_archived ? <MiniIcon name="archive" /> : null}
                  {reply.is_banned ? <MiniIcon name="block-helper" /> : null}
                  {reply.is_bot ? <MiniIcon name="robot" /> : null}
                  {reply.is_nsfl ? (
                    <Badge text="NSFL" fg="white" bg="black" />
                  ) : null}
                  {reply.is_nsfw ? (
                    <Badge text="NSFW" fg="white" bg="red" />
                  ) : null}
                  {reply.is_offensive ? (
                    <Badge text="OFFENSIVE" fg="black" bg="orange" />
                  ) : null}
                </View>
              </View>

              <HtmlMarkdown html={reply.body_html} />
            </>
          )}
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
              highlighted={reply.voted === 1}
            />
            <LoadingControl
              name="arrow-downward"
              onPress={() => vote(-1)}
              highlighted={reply.voted === -1}
            />
            <IconButton name="reply" onPress={() => setPopupVisible(true)} />
          </View>
        ) : null}

        {childRepliesVisible &&
          replies?.map((reply) => <Reply reply={reply} />)}
      </View>
    </DepthContext.Provider>
  );
}

export default function Comments() {
  const route = useRoute<any>();
  const style = useStyle();
  const { loading, body, refresh } = usePost(route.params.post_id);
  const [popupVisible, setPopupVisible] = useState(false);
  const [replies, setReplies] = useState<RuqqusComments>([]);

  useEffect(() => {
    if (body) {
      setReplies(body.replies);
    }
  }, [body]);

  return (
    <ScrollView
      style={style?.root}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => refresh()} />
      }>
      {!loading && body ? (
        <PostContext.Provider value={body}>
          <PostReplyPopup
            parent={body}
            newReply={(comment) =>
              setReplies((prev) =>
                ([] as RuqqusComments).concat([comment], prev),
              )
            }
            toggleModal={() => setPopupVisible((x) => !x)}
            visible={popupVisible}
          />
          <PopupWrapper>
            <DefaultPostcard
              additionalControls={
                <>
                  <IconButton
                    name="reply"
                    onPress={() => setPopupVisible(true)}
                  />
                </>
              }
            />
          </PopupWrapper>

          {replies?.map?.((reply) => (
            <Reply reply={reply} />
          ))}

          {!body?.replies || body?.replies?.length <= 0 ? (
            <NoContent message="No comments found" />
          ) : null}
        </PostContext.Provider>
      ) : null}
    </ScrollView>
  );
}
