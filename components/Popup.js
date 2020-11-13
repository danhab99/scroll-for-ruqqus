import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { SPACE, FONTSIZE, COLORS } from '../theme';
import { IconButton } from './IconButton';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Popup(props) {
  return (<Modal
    transparent={true}
    visible={props.visible}
    animationType="slide"
    onRequestClose={() => props.togglModal()}
  >
    <View style={{
      margin: SPACE(3),
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.5,
      elevation: 5,
      flex: 1,
      justifyContent: 'center'
    }}>
      <View style={{
        backgroundColor: COLORS.backgroundDark,
        padding: SPACE(2),
        width: '100%',
        borderRadius: 10
      }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <IconButton
            icon="close"
            style={{
              marginBottom: SPACE(1)
            }}
            onPress={() => props.togglModal()} />
          <Text style={{
            color: COLORS.text,
            fontSize: FONTSIZE(1.5)
          }}>
            {props.title}
          </Text>
        </View>


        {props.children}
      </View>
    </View>
  </Modal>);
}


export function PopupButton(props) {
  return <Pressable onPress={() => props.onPress()}>
    <View
      style={{
        display: 'flex',
        justifyContent: "flex-start",
        flexDirection: 'row',
        marginBottom: SPACE(0.5)
      }}
    >
      <Icon
        name={props.icon}
        size={30}
        color={COLORS.text} />
      <Text
        style={{
          color: COLORS.text,
          fontSize: FONTSIZE(2),
          marginLeft: SPACE(1)
        }}
      >
        {props.label}
      </Text>
    </View>
  </Pressable>;
}
