import React, {createContext, ReactNode, useContext, useEffect} from 'react';
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  RefreshControlProps,
} from 'react-native';
import {useFeed} from './useFeed';
import {RuqqusPost, RuqqusGuild, RuqqusUser} from './types';

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

export function RuqqusFeed(props: RuqqusFeedProps) {
  const {loading, posts, nextPage, refresh} = useFeed(`${props.feed}`);

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
    <FlatList
      data={posts || []}
      renderItem={renderPost}
      ListHeaderComponent={renderHeader}
      refreshControl={refreshControl}
      // onEndReached={onEndReached}
      {...props}
    />
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
