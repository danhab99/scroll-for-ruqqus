import React from 'react';
import { View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SPACE, FONTSIZE } from './theme'

export function IconButton(props) {
  return (
    <View style={{
      margin: SPACE(props.margin || 0)
    }}>
      <Pressable onPress={() => props.onPress()}>
        <Icon name={props.icon} color={props.color || "white"} style={{
          fontSize: FONTSIZE(props.fontsize || 1)
        }} />
      </Pressable>
    </View>
  )
}