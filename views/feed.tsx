import React, {useState, useEffect} from 'react';
import {FlatList, View, RefreshControl} from 'react-native';
import Style, {COLORS, Darken, Lighten, SPACE} from '../theme';
import Postcard from '../components/Postcard';
import {IconButton, Button} from '../components/Buttons';
import Popup, {PopupButton} from '../components/Popup';
import Input from '../components/Input';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {GuildHeader} from '../components/GuildHeader';

export default function Feed(props) {
  const navigation = useNavigation();
  // const route = useRoute<RouteProp<FeedRouteProps, 'Detail'>>();
  const route = useRoute<?any>();

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [showSorting, setShowSorting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sorting, setSorting] = useState('');
  const [guildHeader, setGuildHeader] = useState(
    route?.params?.['guildHeader'] || false,
  );
  const [searchVal, setSearchVal] = useState('');
  const [guild, setGuild] = useState({});

  const fetch = () => {
    setRefreshing(true);
    return route.params
      .fetch(client, {
        page,
        name: route.params?.name,
        sort: sorting,
      })
      .then((posts) => {
        setRefreshing(false);
        setPosts(page > 0 ? (oldposts) => oldposts.concat(posts) : posts);
      });
  };

  useEffect(() => fetch(), [page, sorting]);

  const refresh = () => {
    fetch().then(() => {
      setRefreshing(false);
    });

    if (route.params.guildHeader) {
      client.guilds.fetch(route.params.name).then((guild) => {
        setGuild(guild, () =>
          navigation.setOptions({
            title: `+${guild.name}`,
          }),
        );
      });
    }
  };

  const getMore = () => {
    if (posts.length > 1 && !refreshing) {
      setPage((x) => x + 1);
    }
  };

  const search = () => {
    let screen = {
      '+': 'Guild',
      '@': 'User',
    }[searchVal];

    navigation.navigate(screen, {
      name: searchVal.substring(1),
      prefix: searchVal[0],
    });
    showSearch(false);
  };

  return (
    <View
      style={{
        ...Style.view,
        paddingBottom: 0,
        paddingTop: 0,
      }}>
      <Popup
        title="Sort"
        visible={showSorting}
        togglModal={() => setShowSorting((x) => !x)}>
        <PopupButton
          label="Hot"
          icon="whatshot"
          onPress={() => setSorting('hot')}
        />

        <PopupButton
          label="New"
          icon="star"
          onPress={() => setSorting('new')}
        />

        <PopupButton
          label="Disputed"
          icon="announcement"
          onPress={() => setSorting('disputed')}
        />

        <PopupButton
          label="Activity"
          icon="chat"
          onPress={() => setSorting('activity')}
        />
      </Popup>

      <Popup
        visible={showSearch}
        title="Go To"
        togglModal={() => setShowSearch((x) => !x)}>
        <Input
          label="+guild or @user"
          onChangeText={(t) => setSearchVal(t)}
          autoCompleteType="off"
          autoCapitalize="none"
          value={searchVal}
        />

        <Button
          disabled={!(searchVal[0] == '+' || searchVal[0] == '@')}
          text="Go to"
          style={{
            marginTop: SPACE(1),
          }}
          onPress={() => search()}
        />
      </Popup>

      <FlatList
        ref={this.flatlist}
        data={posts}
        renderItem={(props) => <Postcard post={props.item} />}
        onEndReached={() => getMore()}
        onEndReachedThreshold={5}
        initialNumToRender={20}
        ListHeaderComponent={
          <GuildHeader guild={guild} enabled={guildHeader} />
        }
        style={{
          paddingTop: guildHeader ? 0 : SPACE(1),
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refresh()}
            title="Pull to refresh"
            colors={[
              COLORS.primary,
              Lighten(COLORS.primary),
              Darken(COLORS.primary),
            ]}
          />
        }
        keyExtractor={(item, index) => `${index}`}
      />
    </View>
  );
}
