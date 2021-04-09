import React from 'react';
import {View, Pressable, Text} from 'react-native';
import {SPACE, FONTSIZE, COLORS} from '../theme';
import {OptionalEventHandler} from './OptionalEventHandler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {IconButtonProps} from 'react-native-vector-icons/Icon';
import {useStyle} from '@contexts';

export function IconButton(props: IconButtonProps) {
  const style = useStyle();

  if (style) {
    return <Icon.Button style={style.iconButton as any} {...props} />;
  }
}

interface ButtonProps {
  disabled?: boolean;
  onPress?: OptionalEventHandler;
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
