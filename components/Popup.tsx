import React from 'react';
import {View, Text, Modal, Pressable} from 'react-native';
import {SPACE, FONTSIZE, COLORS} from '../theme';
import {IconButton} from './Buttons';
import {OptionalEventHandler} from './OptionalEventHandler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../contexts/theme-context';

interface PopupProps {
  visible: boolean;
  toggleModal: (() => void) | undefined;
  title: string;
  children: React.ReactNode;
}

export default function Popup(props: PopupProps) {
  const theme = useTheme();

  return (
    <Modal
      transparent={true}
      visible={props.visible}
      animationType="slide"
      onRequestClose={() => props.toggleModal?.()}>
      <View
        style={{
          margin: SPACE(3),
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          elevation: 5,
          flex: 1,
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: COLORS.backgroundDark,
            padding: SPACE(2),
            width: '100%',
            borderRadius: 10,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <IconButton
              name="close"
              style={{
                // marginBottom: SPACE(1),
                backgroundColor: theme?.Colors.backgroundDark,
              }}
              onPress={() => props.toggleModal?.()}
            />
            <Text
              style={{
                color: COLORS.text,
                fontSize: FONTSIZE(2),
              }}>
              {props.title}
            </Text>
          </View>

          <View
            style={{
              marginTop: theme?.Space.get?.(1),
            }}>
            {props.children}
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface PopupButtonProps {
  onPress: OptionalEventHandler;
  icon: string;
  label: string;
}

export function PopupButton(props: PopupButtonProps) {
  return (
    <Pressable onPress={() => props.onPress?.()}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: SPACE(0.5),
        }}>
        <Icon name={props.icon} size={30} color={COLORS.text} />
        <Text
          style={{
            color: COLORS.text,
            fontSize: FONTSIZE(2),
            marginLeft: SPACE(1),
          }}>
          {props.label}
        </Text>
      </View>
    </Pressable>
  );
}
