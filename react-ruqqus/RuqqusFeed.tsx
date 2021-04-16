import React, {
  createContext,
  useRef,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  RefreshControlProps,
} from "react-native";
import { useFeed } from "./useFeed";
import { RuqqusPost, RuqqusGuild, RuqqusUser, RuqqusVote } from "./types";
import { useRuqqusClient } from "./useRuqqusClient";
import { fetcher } from "./fetcher";
import { useRuqqusFetch } from "./useRuqqusFetch";

export const PostContext = createContext<RuqqusPost>({} as RuqqusPost);
const GuildContext = createContext<RuqqusGuild>({} as RuqqusGuild);
const UserContext = createContext<RuqqusUser>({} as RuqqusUser);

type FeedOptions = "front" | "all" | { guild: string } | { user: string };
export type SortOptions = "hot" | "top" | "new" | "disputed" | "activity";

interface PostProps {
  item: RuqqusPost;
}

interface RuqqusFeedProps extends Partial<FlatListProps<RuqqusPost>> {
  feed: FeedOptions;
  sort?: SortOptions;
  renderPost: () => ReactNode;
  renderGuildHeader: () => ReactNode;
  renderUserHeader: () => ReactNode;
  refreshControlProps?: RefreshControlProps;
  refreshRef: React.Ref<() => void>;
}

type PostMutatorDispatch = React.Dispatch<
  React.SetStateAction<RuqqusPost[] | undefined>
>;

const PostMutatorContext = createContext<PostMutatorDispatch>(
  {} as PostMutatorDispatch,
);

function GuildManager(props: { guild: string; children: ReactNode }) {
  const { loading, body } = useRuqqusFetch(`guild/${props.guild}`);

  if (loading) {
    return <ActivityIndicator />;
  } else {
    return (
      <GuildContext.Provider value={body as RuqqusGuild}>
        {props.children}
      </GuildContext.Provider>
    );
  }
}

function UserManager(props: { user: string; children: ReactNode }) {
  const { loading, body } = useRuqqusFetch(`user/${props.user}`);

  if (loading) {
    return <ActivityIndicator />;
  } else {
    return (
      <UserContext.Provider value={body as RuqqusUser}>
        {props.children}
      </UserContext.Provider>
    );
  }
}
export function RuqqusFeed(props: RuqqusFeedProps) {
  const renderPost = props.renderPost
    ? (p: PostProps) => (
        <PostContext.Provider value={p.item}>
          {props.renderPost(p)}
        </PostContext.Provider>
      )
    : props.renderItem;

  var renderHeader = props.ListHeaderComponent;
  var feed: any = props.feed;

  if (typeof props.feed === "object") {
    if ("guild" in props.feed) {
      renderHeader = (
        <GuildManager guild={props.feed.guild}>
          {props.renderGuildHeader()}
        </GuildManager>
      );
      feed = "guild/" + props.feed.guild;
    } else if ("user" in props.feed) {
      renderHeader = (
        <UserManager user={props.feed.user}>
          {props.renderUserHeader()}
        </UserManager>
      );
      feed = "user/" + props.feed.user;
    }
  }

  const { loading, posts, nextPage, refresh, setPosts } = useFeed(feed, {
    sort: props?.sort || "hot",
  });
  const client = useRuqqusClient();

  const flatlistRef = useRef<FlatList<RuqqusPost>>();

  const doRefresh = () => {
    refresh();
    flatlistRef?.current?.scrollToOffset?.({ offset: 0, animated: true });
  };

  useEffect(() => {
    doRefresh();
  }, [client]);

  props.refreshRef.current = () => doRefresh();

  const onEndReached = props.onEndReached || (() => nextPage());

  const refreshControl = props.refreshControl || (
    <RefreshControl
      refreshing={loading}
      onRefresh={() => refresh()}
      {...props.refreshControlProps}
    />
  );

  return (
    <PostMutatorContext.Provider value={setPosts}>
      <FlatList
        ref={flatlistRef}
        data={posts || []}
        renderItem={renderPost}
        ListHeaderComponent={renderHeader}
        refreshControl={refreshControl}
        onEndReachedThreshold={props.onEndReachedThreshold || 3}
        onEndReached={onEndReached}
        {...props}
      />
    </PostMutatorContext.Provider>
  );
}

export function usePost() {
  return useContext(PostContext);
}

export function useUser() {
  return useContext(UserContext);
}

export function useGuild() {
  return useContext(GuildContext);
}

export function useVote() {
  const post = usePost();
  const client = useRuqqusClient();
  const mutate = useContext(PostMutatorContext);

  const vote = (dir: RuqqusVote) => {
    let d = post.voted === dir ? 0 : dir;
    return fetcher(client.domain, `api/v1/vote/post/${post.id}/${d}`, {
      access_token: client.access_token,
      body: {},
    })
      .then((resp) => {
        if (resp.ok) {
          return fetcher(client.domain, `api/v1/post/${post.id}`, {
            access_token: client.access_token,
          });
        } else {
          throw resp;
        }
      })
      .then((resp) => {
        let p: RuqqusPost = resp.body;

        mutate((prev) => prev?.map((x) => (x.id === p.id ? p : x)));
        return resp;
      });
  };

  return {
    upvote: () => vote(1),
    downvote: () => vote(-1),
    reset: () => vote(0),
  };
}
