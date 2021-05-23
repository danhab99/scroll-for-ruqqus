import React, {
  createContext,
  useRef,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  RefreshControlProps,
} from "react-native";
import { RuqqusFeedSequence, useFeed } from "./useFeed";
import { RuqqusPost, RuqqusGuild, RuqqusUser, RuqqusVote } from "./types";
import { useRuqqusClient } from "./useRuqqusClient";
import { fetcher } from "./fetcher";
import { useRuqqusFetch } from "./useRuqqusFetch";

export const PostContext = createContext<RuqqusPost>({} as RuqqusPost);
const GuildContext = createContext<RuqqusGuild>({} as RuqqusGuild);
const UserContext = createContext<RuqqusUser>({} as RuqqusUser);

export type FeedOptions =
  | "front"
  | "all"
  | { guild: string }
  | { user: string };
export type SortOptions = "hot" | "top" | "new" | "disputed" | "activity";

interface PostProps {
  item: RuqqusPost;
}

interface RuqqusFeedProps {
  feed: FeedOptions;
  sort?: SortOptions;
  renderPost: () => ReactNode;
  renderGuildHeader: () => ReactNode;
  renderUserHeader: () => ReactNode;
  refreshControlProps?: RefreshControlProps;
  refreshRef: React.Ref<() => void>;
}

type PostMutatorDispatch = React.Dispatch<
  React.SetStateAction<RuqqusFeedSequence | undefined>
>;

const PostMutatorContext = createContext<PostMutatorDispatch>(
  {} as PostMutatorDispatch,
);

interface ContextManagerProps<T> {
  edge: string;
  target: string;
  children: ReactNode;
  context: React.Context<T>;
}

function ContextManager<T>(props: ContextManagerProps<T>) {
  const { loading, body } = useRuqqusFetch(`${props.edge}/${props.target}`);

  const Context = props.context;

  if (loading) {
    return <ActivityIndicator />;
  } else {
    return (
      <Context.Provider value={body as T}>{props.children}</Context.Provider>
    );
  }
}

export function RuqqusFeed(
  props: RuqqusFeedProps & Partial<FlatListProps<RuqqusPost>>,
) {
  const renderPost = props.renderPost
    ? (p: PostProps) => (
        <PostContext.Provider value={p.item}>
          {props.renderPost()}
        </PostContext.Provider>
      )
    : props.renderItem;

  var renderHeader = props.ListHeaderComponent;

  if (typeof props.feed === "object") {
    if ("guild" in props.feed) {
      renderHeader = (
        <ContextManager
          context={GuildContext}
          edge="guild"
          target={props.feed.guild}>
          {props.renderGuildHeader()}
        </ContextManager>
      );
    } else if ("user" in props.feed) {
      renderHeader = (
        <ContextManager
          context={UserContext}
          edge="user"
          target={props.feed.user}>
          {props.renderUserHeader()}
        </ContextManager>
      );
    }
  }

  const { loading, posts, nextPage, refresh, setPosts } = useFeed(props.feed, {
    sort: props?.sort || "hot",
  });
  const client = useRuqqusClient();

  const flatlistRef = useRef<FlatList<RuqqusPost> | null>();

  const doRefresh = () => {
    refresh();
    flatlistRef?.current?.scrollToOffset?.({ offset: 0, animated: true });
  };

  useEffect(() => {
    doRefresh();
  }, [client]);

  if (props.refreshRef) {
    props.refreshRef = () => doRefresh();
  }

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
        ref={(r) => {
          flatlistRef.current = r;
        }}
        keyExtractor={(e) => e.fullname}
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

export function useContextPost() {
  return useContext(PostContext);
}

export function useContextUser() {
  return useContext(UserContext);
}

export function useContextGuild() {
  return useContext(GuildContext);
}

export function useVote() {
  const post = useContextPost();
  const client = useRuqqusClient();
  const mutate = useContext(PostMutatorContext);

  const vote = (dir: RuqqusVote) => {
    let d = post.voted === dir ? 0 : dir;
    return fetcher<RuqqusPost, {}>(
      client.domain,
      `api/v1/vote/post/${post.id}/${d}`,
      {
        access_token: client.access_token,
        body: {},
      },
    )
      .then((resp) => {
        if (resp.ok) {
          return fetcher<RuqqusPost>(client.domain, `api/v1/post/${post.id}`, {
            access_token: client.access_token,
          });
        } else {
          throw resp;
        }
      })
      .then((resp) => {
        let p = resp.body;
        mutate((prev) => ({
          data: prev?.data.map((x) => (x.fullname === p.fullname ? p : x)),
          next_exists: prev?.next_exists,
        }));
        return resp;
      });
  };

  return {
    upvote: () => vote(1),
    downvote: () => vote(-1),
    reset: () => vote(0),
  };
}
