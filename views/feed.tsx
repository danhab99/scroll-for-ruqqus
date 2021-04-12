import React, {useState, useEffect, createRef} from 'react';
import {View, Share, Linking} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {RuqqusFeed, usePost} from 'react-ruqqus';
import {useValue, useStyle, useTheme} from '@contexts';
import * as _ from 'lodash';

import {GuildHeader} from '../components/GuildHeader';
import {UserHeader} from '../components/UserHeader';
import {IconButton} from 'components/Buttons';
import Popup, {PopupButton} from 'components/Popup';
import {RuqqusPost} from 'react-ruqqus/types';
import {PostMenuContext} from '../contexts/post-menu-context';
import {CardSelector} from '../components/postcards/cardSelector';

export default function Feed() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const style = useStyle();
  const theme = useTheme();
  const [activeAccount] = useValue<string>('active-account');

  const [sortPopupVisible, setSortPopupVisible] = useState(false);
  const [sort, setSort] = useState('hot');

  const [menuPost, setMenuPost] = useState<RuqqusPost>();

  const refreshRef = createRef<() => void>();

  useEffect(() => {
    let h = () => {
      if (_.isEmpty(activeAccount)) {
        navigation.navigate('Login');
      }
    };

    navigation.addListener('focus', h);
    return () => navigation.removeListener('focus', h);
  }, [activeAccount]);

  useEffect(() => {
    let feed = route.params.feed;
    if (typeof feed === 'object') {
      if ('user' in feed) {
        navigation.setOptions({
          title: `@${feed.user}`,
        });
      } else if ('guild' in feed) {
        navigation.setOptions({
          title: `+${feed.guild}`,
        });
      }
    } else {
      navigation.setOptions({
        title: `${feed[0].toUpperCase()}${feed.slice(1)}`,
      });
    }

    navigation.setOptions({
      headerRight: () => (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <IconButton name="refresh" onPress={() => refreshRef?.current?.()} />
          <IconButton
            name="sort-amount-desc"
            onPress={() => setSortPopupVisible(true)}
          />
          <IconButton name="search" />
        </View>
      ),
    });
  }, []);

  const doSetSort = (x: string) => () => {
    setSort(x);
    setSortPopupVisible(false);
  };

  return (
    <View>
      <Popup
        visible={sortPopupVisible}
        toggleModal={() => setSortPopupVisible((x) => !x)}
        title="Sort">
        <PopupButton icon="fire" label="Hot" onPress={doSetSort('hot')} />
        <PopupButton
          icon="arrow-circle-o-up"
          label="Top"
          onPress={doSetSort('top')}
        />
        <PopupButton icon="star" label="New" onPress={doSetSort('new')} />
        <PopupButton
          icon="bullhorn"
          label="disputed"
          onPress={doSetSort('disputed')}
        />
        <PopupButton
          icon="wechat"
          label="activity"
          onPress={doSetSort('activity')}
        />
      </Popup>

      {menuPost ? (
        <Popup
          visible={menuPost ? true : false}
          toggleModal={() => setMenuPost(undefined)}
          title="More actions">
          <PopupButton
            label="Share"
            icon="share"
            onPress={() => {
              Share.share({message: menuPost.url});
              setMenuPost(undefined);
            }}
          />
          <PopupButton
            label="Comments"
            icon="comments"
            onPress={() => {
              navigation.push('Comments', {post_id: menuPost.id});
              setMenuPost(undefined);
            }}
          />
          <PopupButton
            label={`Go to @${menuPost.author_name}`}
            icon="user"
            onPress={() => {
              navigation.push(route.name, {
                feed: {user: menuPost.author_name},
              });
              setMenuPost(undefined);
            }}
          />
          <PopupButton
            label={`Go to +${menuPost.guild_name}`}
            icon="plus"
            onPress={() => {
              navigation.push(route.name, {
                feed: {guild: menuPost.guild_name},
              });
              setMenuPost(undefined);
            }}
          />
          <PopupButton
            label="Open In Browser"
            icon="chrome"
            onPress={() => {
              Linking.canOpenURL(menuPost.url).then(() =>
                Linking.openURL(menuPost.url),
              );
              setMenuPost(undefined);
            }}
          />
        </Popup>
      ) : null}

      <PostMenuContext.Provider value={[menuPost, setMenuPost]}>
        <RuqqusFeed
          feed={route.params.feed}
          renderPost={() => <CardSelector />}
          renderGuildHeader={() => <GuildHeader />}
          renderUserHeader={() => <UserHeader />}
          style={style?.root}
          contentContainerStyle={{
            marginTop:
              typeof route.params.feed === 'object' ? 0 : theme?.Space.get?.(1),
          }}
          refreshRef={refreshRef}
          sort={sort}
        />
      </PostMenuContext.Provider>
    </View>
  );
}
