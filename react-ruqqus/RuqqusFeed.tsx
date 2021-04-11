import React, {createContext, ReactNode, useContext, useEffect} from 'react';
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  RefreshControlProps,
} from 'react-native';
import {useFeed} from './useFeed';
import {RuqqusPost, RuqqusGuild, RuqqusUser, RuqqusVote} from './types';
import {useRuqqusClient} from './useRuqqusClient';
import {fetcher} from './fetcher';

const PostContext = createContext<RuqqusPost>({} as RuqqusPost);
const GuildContext = createContext<RuqqusGuild>({} as RuqqusGuild);
const UserContext = createContext<RuqqusUser>({} as RuqqusUser);

type FeedOptions = 'front' | 'all' | {guild: string} | {user: string};
type SortOptions = 'hot' | 'top' | 'new' | 'disputed' | 'activity';

interface PostProps {
  item: RuqqusPost;
}

interface GuildProps {
  guild: RuqqusGuild;
}

interface UserProps {
  user: RuqqusUser;
}

interface RuqqusFeedProps extends Partial<FlatListProps<RuqqusPost>> {
  feed: FeedOptions;
  sort?: SortOptions;
  renderPost: (props: PostProps) => ReactNode;
  renderGuildHeader: (props: GuildProps) => ReactNode;
  renderUserHeader: (props: UserProps) => ReactNode;
  refreshControlProps?: RefreshControlProps;
}

type PostMutatorDispatch = React.Dispatch<
  React.SetStateAction<RuqqusPost[] | undefined>
>;

const PostMutatorContext = createContext<PostMutatorDispatch>(
  {} as PostMutatorDispatch,
);

export function RuqqusFeed(props: RuqqusFeedProps) {
  const {loading, posts, nextPage, refresh, setPosts} = useFeed(
    `${props.feed}`,
  );

  const renderPost = props.renderPost
    ? (p: PostProps) => (
        <PostContext.Provider value={p.item}>
          {props.renderPost(p)}
        </PostContext.Provider>
      )
    : props.renderItem;

  var renderHeader = props.ListHeaderComponent;

  if (typeof props.feed === 'object') {
    if ('guild' in props.feed) {
      renderHeader = (p: GuildProps) => (
        <GuildContext.Provider value={p.guild}>
          {props.renderGuildHeader(p)}
        </GuildContext.Provider>
      );
    } else if ('user' in props.feed) {
      renderHeader = (p: UserProps) => (
        <UserContext.Provider value={p.user}>
          {props.renderUserHeader(p)}
        </UserContext.Provider>
      );
    }
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
    return fetcher(client.domain, `vote/${post.id}/${d}`, {
      access_token: client.access_token,
    }).then((resp) => {
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
