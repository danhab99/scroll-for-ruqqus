import React from 'react';
import {usePost} from '@react-ruqqus';
import {View, Text} from 'react-native';
import {useStyle} from '@contexts';

export function Title() {
  const post = usePost();
  const style = useStyle();

  return (
    <View>
      <Text style={style?.title}>{post.title}</Text>
    </View>
  );
}
