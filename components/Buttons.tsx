import React from 'react';
import {
  View,
  Pressable,
  Text,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from '../icons/icon';
import {SPACE, FONTSIZE, COLORS} from '../theme';
import {OptionalEventHandler} from './OptionalEventHandler';

interface IconButtonProps {
  onPress: OptionalEventHandler;
  style: object;
  onLongPress?: OptionalEventHandler;
  icon: string | undefined;
  color?: string;
  fontSize?: number;
}

export function IconButton(props: IconButtonProps) {
  return (
    <View
      style={{
        ...props.style,
        borderRadius: 20,
      }}>
      <Pressable
        onPress={() => props.onPress && props.onPress()}
        onLongPress={() => props.onLongPress && props.onLongPress()}
        delayLongPress={500}
        android_ripple={{
          color: COLORS.primary,
          borderless: true,
        }}
        hitSlop={SPACE(1.5)}>
        <Icon
          name={props.icon}
          color={props.color || 'white'}
          size={props.fontSize}
        />
      </Pressable>
    </View>
  );
}

interface ButtonProps {
  disabled: boolean;
  onPress: OptionalEventHandler;
  text?: string;
  style?: object;
}

export function Button(props: ButtonProps) {
  return (
    <Pressable onPress={() => !props.disabled && props?.onPress?.()}>
      <Text
        style={{
          backgroundColor: props.disabled ? COLORS.muted : COLORS.primary,
          color: COLORS.text,
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: FONTSIZE(1.5),
          padding: SPACE(0.5),
          borderRadius: 5,
          ...props.style,
        }}>
        {props.text}
      </Text>
    </Pressable>
  );
}
