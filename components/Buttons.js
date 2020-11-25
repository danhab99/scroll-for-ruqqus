import React from 'react';
import { View, Pressable, Text } from 'react-native';
import Icon from '../icons/icon'
import { SPACE, FONTSIZE, COLORS } from '../theme';

export function IconButton(props) {
  return (
    <View style={{
      ...props.style,
      borderRadius: 20
    }}>
      <Pressable 
        onPress={() => props.onPress && props.onPress()} 
        onLongPress={() => props.onLongPress && props.onLongPress()} 
        delayLongPress={100}
        android_ripple={{
          color: COLORS.primary,
          borderless: true
        }}
      >
        <Icon name={props.icon} color={props.color || "white"} size={props.fontSize} />
        {/* <Icon name={props.icon} color={props.color || "white"} style={{
          fontSize: FONTSIZE(props.fontsize || 4)
        }} /> */}
      </Pressable>
    </View>
  );
}

export function Button(props) {
  return (<Pressable onPress={() => !props.disabled && props.onPress()}>
    <Text
      style={{
        backgroundColor: props.disabled ? COLORS.muted : COLORS.primary,
        color: COLORS.text,
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: FONTSIZE(1.5),
        padding: SPACE(0.5),
        borderRadius: 5,
        ...props.style
      }}
    >
      {props.text}
    </Text>
  </Pressable>);
}
