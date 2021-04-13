import React from 'react';
import {View, Text, Modal, Pressable} from 'react-native';
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
          margin: theme?.Space?.get?.(3),
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.5,
          elevation: 5,
          flex: 1,
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: theme?.Colors?.backgroundDark,
            padding: theme?.Space?.get?.(2),
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
                color: theme?.Colors?.text,
                fontSize: theme?.FontSize?.get?.(2),
                flexWrap: 'wrap',
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
  const theme = useTheme();

  return (
    <Pressable onPress={() => props.onPress?.()}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: theme?.Space?.get?.(0.5),
        }}>
        <Icon name={props.icon} size={30} color={theme?.Colors?.text} />
        <Text
          style={{
            color: theme?.Colors?.text,
            fontSize: theme?.FontSize?.get?.(2),
            marginLeft: theme?.Space?.get?.(1),
          }}>
          {props.label}
        </Text>
      </View>
    </Pressable>
  );
}
