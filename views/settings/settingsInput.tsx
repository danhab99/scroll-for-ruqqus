import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme, useValue } from "@contexts";
import Icon from "react-native-vector-icons/MaterialIcons";
import CheckBox from "@react-native-community/checkbox";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/core";
import Popup, { PopupButton } from "components/Popup";
import { TriangleColorPicker } from "react-native-color-picker";

type SettingsType =
  | { type: "choice"; choices: string[] }
  | { type: "number"; min: number; max: number }
  | { type: "checkbox" }
  | { type: "navigate"; screen: string }
  | { type: "color" };

interface SettingsInputProps {
  iconName: string;
  title: string;
  description: string;
  type: SettingsType;
  address: string[];
  default: any;
  screen?: string;
}

export function SettingsInput(props: SettingsInputProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const [value, setValue] = useValue<any>("settings", ...props.address);
  const [popupVisible, setPopupVisible] = useState(false);

  setValue((prev: any) => (typeof prev === "undefined" ? props.default : prev));

  const onPress = () => {
    switch (props.type.type) {
      case "checkbox":
        setValue((x: boolean) => !x);
        break;
      case "navigate":
        navigation.navigate(props?.screen || "");
        break;

      case "color":
      case "choice":
        setPopupVisible(true);
        break;
    }
  };

  return (
    <View>
      <Popup
        title={props.title}
        toggleModal={() => setPopupVisible((x) => !x)}
        visible={popupVisible}>
        {props.type.type === "choice" &&
          props.type.choices.map((choice) => (
            <PopupButton
              icon={`radio-button-${value === choice ? "on" : "off"}`}
              label={choice}
              onPress={() => {
                setValue(choice);
                setPopupVisible(false);
              }}
            />
          ))}

        {props.type.type === "color" ? (
          <TriangleColorPicker
            color={value}
            onColorChange={(color) => setValue(color)}
          />
        ) : null}
      </Popup>

      <Pressable onPress={() => onPress()}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Icon name={props.iconName} />

          <View>
            <Text
              style={{
                color: theme?.Colors.text,
                fontSize: theme?.FontSize.get?.(2),
              }}>
              {props.title}
            </Text>

            <Text
              style={{
                color: theme?.Colors.muted,
                fontSize: theme?.FontSize.get?.(1),
              }}>
              {props.description}

              {props.type.type === "number" ? (
                <Slider
                  minimumValue={props.type.min}
                  maximumValue={props.type.max}
                />
              ) : null}
            </Text>

            <View>
              {props.type.type === "checkbox" ? (
                <CheckBox value={value} onValueChange={(v) => setValue(v)} />
              ) : null}

              {props.type.type === "navigate" ? (
                <Icon name="keyboard-arrow-right" />
              ) : null}

              {props.type.type === "number" ? <Text>{value}</Text> : null}

              {props.type.type === "color" ? (
                <Icon name="circle" style={{ color: value }} />
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
