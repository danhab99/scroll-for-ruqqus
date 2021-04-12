import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {RuqqusFeed, usePost} from 'react-ruqqus';
import {useValue, useStyle, useCollection} from '@contexts';
import * as _ from 'lodash';

import DefaultPostcard from '../components/postcards/default/postcard';

function User() {
  return <View></View>;
}

function Guild() {
  return <View></View>;
}

export default function Feed() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const style = useStyle();

  const [activeAccount] = useValue<string>('active-account');

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
  }, []);

  return (
    <RuqqusFeed
      feed={route.params.feed}
      renderPost={(p) => <DefaultPostcard />}
      renderGuildHeader={(g) => <Guild />}
      renderUserHeader={(u) => <User />}
      style={style?.view}
    />
  );
}
