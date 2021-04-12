import React, {useState, useEffect, createRef} from 'react';
import {View, Text} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {RuqqusFeed, usePost} from 'react-ruqqus';
import {useValue, useStyle, useTheme} from '@contexts';
import * as _ from 'lodash';

import DefaultPostcard from '../components/postcards/default/postcard';
import {GuildHeader} from '../components/GuildHeader';
import {UserHeader} from '../components/UserHeader';
import {IconButton} from 'components/Buttons';
import Popup, {PopupButton} from 'components/Popup';

export default function Feed() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const style = useStyle();
  const theme = useTheme();
  const [activeAccount] = useValue<string>('active-account');

  const [sortPopupVisible, setSortPopupVisible] = useState(false);
  const [sort, setSort] = useState('hot');

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

      <RuqqusFeed
        feed={route.params.feed}
        renderPost={() => <DefaultPostcard />}
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
    </View>
  );
}
