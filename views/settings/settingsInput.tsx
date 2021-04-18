import React, { useState } from "react";
import { View, Text, Pressable, SliderProps } from "react-native";
import { useTheme, useValue, useStyle } from "@contexts";
import Icon from "react-native-vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/core";
import Popup, { PopupButton } from "components/Popup";
import { ColorPicker } from "components/ColorPicker";

type SettingsType =
  | { type: "choice"; choices: string[] }
  | { type: "number"; min: number; max: number }
  | { type: "checkbox" }
  | { type: "navigate"; screen: string }
  | { type: "color" };

interface SettingsInputProps {
  iconName: string;
  title: string;
  description?: string;
  type: SettingsType;
  address: string[];
  default: any;
  screen?: string;
}

export function SettingsInput(props: SettingsInputProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const style = useStyle();
  const [value, setValue] = useValue<any>(...props.address);
  const [popupVisible, setPopupVisible] = useState(false);

  // if (typeof value === 'undefined') {
  //   debugger;
  //   setValue(props.default);
  // }

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
    <View style={{ marginBottom: theme?.Space.get?.(1) }}>
      <Popup
        title={props.title}
        toggleModal={() => setPopupVisible((x) => !x)}
        visible={popupVisible}>
        {props.type.type === "choice" &&
          props.type.choices.map((choice, i) => {
            return (
              <PopupButton
                key={i}
                icon={`radio-button-${value === choice ? "on" : "off"}`}
                label={choice}
                onPress={() => {
                  setValue(choice);
                  setPopupVisible(false);
                }}
              />
            );
          })}

        {props.type.type === "color" ? (
          <View>
            <ColorPicker
              onColorChange={(color) => setValue(color)}
              initialColor={value || props.default}
            />
          </View>
        ) : null}
      </Popup>

      <Pressable onPress={() => onPress()}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Icon
            name={props.iconName}
            size={theme?.FontSize.get?.(8)}
            color={props.type.type === "color" ? value : theme?.Colors.text}
          />

          <View style={{ width: "80%" }}>
            <Text
              style={{
                color: theme?.Colors.text,
                fontSize: theme?.FontSize.get?.(1),
              }}>
              {props.title}
            </Text>

            <Text
              style={{
                color: theme?.Colors.muted,
                fontSize: theme?.FontSize.get?.(0.6),
                flexWrap: "wrap",
              }}>
              {props.description}
            </Text>

            {props.type.type === "number" ? (
              <Slider
                minimumValue={props.type.min}
                maximumValue={props.type.max}
              />
            ) : null}
          </View>
          <View>
            {props.type.type === "checkbox" ? (
              <Icon
                name={`check-box${value ? "" : "-outline-blank"}`}
                size={theme?.FontSize.get?.(5)}
                color={value ? theme?.Colors.primary : theme?.Colors.text}
              />
            ) : null}

            {props.type.type === "navigate" ? (
              <Icon name="keyboard-arrow-right" />
            ) : null}

            {props.type.type === "number" ? <Text>{value}</Text> : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
