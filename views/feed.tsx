import React, {useState, useEffect} from 'react';
import {FlatList, View, RefreshControl} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';

export default function Feed() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  return <View></View>;
}
