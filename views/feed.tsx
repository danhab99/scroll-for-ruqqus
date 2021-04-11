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

  return (
    <RuqqusFeed
      feed="front"
      renderPost={(p) => <DefaultPostcard />}
      renderGuildHeader={(g) => <Guild />}
      renderUserHeader={(u) => <User />}
      style={style?.view}
    />
  );
}
